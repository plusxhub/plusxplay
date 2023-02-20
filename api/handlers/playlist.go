package handlers

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	db "github.com/milindmadhukar/plusxplay/db/sqlc"
	"github.com/milindmadhukar/plusxplay/models"
	"github.com/milindmadhukar/plusxplay/utils"
	"github.com/rs/zerolog/log"
)

var currentWinner *db.GetRandomPlaylistRow

func GetUserPlaylistHandler(queries *db.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var resp map[string]interface{} = make(map[string]interface{})

		jwtTokenCookie, err := r.Cookie("token")

		if err != nil {
			resp["error"] = "No token found"
			utils.JSON(w, http.StatusUnauthorized, resp)
			return
		}

		spotifyId, errMsg, status := utils.GetSpotifyUserIDFromJWT(jwtTokenCookie.Value)
		if errMsg != "" {
			resp["error"] = errMsg
			utils.JSON(w, status, resp)
			return
		}

		token, err := utils.GetOrUpdateSpotifyToken(spotifyId, queries, r.Context(), w)

		if err != nil {
			resp["error"] = "Error getting spotify token"
			log.Error().Msg(err.Error())
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		userSpotifyID := chi.URLParam(r, "userSpotifyId")
		if userSpotifyID == "" {
			resp["error"] = "No user ID provided"
			utils.JSON(w, http.StatusBadRequest, resp)
			return
		}

		playlist, err := queries.GetPlaylist(r.Context(), userSpotifyID)
		if err != nil {
			resp["error"] = err.Error()
			log.Error().Msg(err.Error())
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		ids := []string{playlist.Choice1, playlist.Choice2, playlist.Choice3, playlist.Choice4, playlist.Choice5, playlist.Choice6, playlist.Choice7, playlist.Choice8, playlist.Choice9, playlist.Choice10}

		tracks, err := utils.GetSpotifySongs(token.AccessToken, ids)

		if err != nil {
			resp["error"] = err.Error()
			log.Error().Msg(err.Error())
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		utils.JSON(w, http.StatusOK, tracks)
	}
}

func SelectRandomUserHandler(queries *db.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var resp map[string]interface{} = make(map[string]interface{})

		jwtTokenCookie, err := r.Cookie("token")

		if err != nil {
			resp["error"] = "No token found"
			utils.JSON(w, http.StatusUnauthorized, resp)
			return
		}

		spotifyId, errMsg, status := utils.GetSpotifyUserIDFromJWT(jwtTokenCookie.Value)
		if errMsg != "" {
			resp["error"] = errMsg
			utils.JSON(w, status, resp)
			return
		}

		if !utils.IsAdmin(spotifyId) {
			resp["error"] = "You are not an admin"
			utils.JSON(w, http.StatusUnauthorized, resp)
			return
		}

		playlist, err := queries.GetRandomPlaylist(r.Context())
		if err != nil {
			resp["error"] = err.Error()
			log.Error().Msg(err.Error())
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		currentWinner = &playlist

		utils.JSON(w, http.StatusOK, playlist)
		return
	}
} // This just selects a user to redo.

func SelectWinnerHandler(queries *db.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var resp map[string]interface{} = make(map[string]interface{})

		jwtTokenCookie, err := r.Cookie("token")

		if err != nil {
			resp["error"] = "No token found"
			utils.JSON(w, http.StatusUnauthorized, resp)
			return
		}

		spotifyId, errMsg, status := utils.GetSpotifyUserIDFromJWT(jwtTokenCookie.Value)
		if errMsg != "" {
			resp["error"] = errMsg
			utils.JSON(w, status, resp)
			return
		}

		if !utils.IsAdmin(spotifyId) {
			resp["error"] = "You are not an admin"
			utils.JSON(w, http.StatusUnauthorized, resp)
			return
		}

		winner := currentWinner

		if winner == nil {
			resp["error"] = "No winner chosen yet"
			utils.JSON(w, http.StatusBadRequest, resp)
			return
		}

		token, err := utils.GetOrUpdateSpotifyToken(models.Config.API.AdminIDs[0], queries, r.Context(), w)

		if err != nil {
			resp["error"] = "Error getting spotify token"
			log.Error().Msg(err.Error())
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		playlist, err := queries.GetPlaylist(r.Context(), winner.SpotifyID)
		if err != nil {
			resp["error"] = err.Error()
			log.Error().Msg(err.Error())
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		ids := []string{playlist.Choice1, playlist.Choice2, playlist.Choice3, playlist.Choice4, playlist.Choice5, playlist.Choice6, playlist.Choice7, playlist.Choice8, playlist.Choice9, playlist.Choice10}

		err = utils.SetPlaylist(token.AccessToken, ids)

		if err != nil {
			resp["error"] = err.Error()
			log.Error().Msg(err.Error())
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		resp["msg"] = "Playlist has been set successfully."

		err = utils.SetSpotifyPlaylistCoverImage(currentWinner.DisplayName, currentWinner.ImageUrl.String, token.AccessToken)

    if err != nil {
      resp["error"] = err.Error()
    }

		utils.JSON(w, http.StatusOK, resp)
	}
}

func GetCurrentWinnerHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var resp map[string]interface{} = make(map[string]interface{})

		if currentWinner != nil {
			utils.JSON(w, http.StatusOK, *currentWinner)
			return
		} else {
			resp["winner"] = nil
		}

		utils.JSON(w, http.StatusOK, resp)
		return
	}
}
