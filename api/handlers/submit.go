package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	db "github.com/milindmadhukar/plusxplay/db/sqlc"
	"github.com/milindmadhukar/plusxplay/models"
	"github.com/milindmadhukar/plusxplay/utils"
	"github.com/rs/zerolog/log"
)

func SubmitPlaylistHandlers(queries *db.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var submission models.Submission
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

		err = json.NewDecoder(r.Body).Decode(&submission)
		if err != nil {
			resp["error"] = err.Error()
			utils.JSON(w, http.StatusBadRequest, resp)
			return
		}

		if len(submission.SelectedSongs) != 10 {
			resp["error"] = "10 songs required."
			utils.JSON(w, http.StatusBadRequest, resp)
			return
		}

		log.Info().Msg(spotifyId + " submitted a playlist")

		_, err = queries.CreateOrUpdatePlaylist(r.Context(), db.CreateOrUpdatePlaylistParams{
			SpotifyUserID: spotifyId,
			Choice1:       submission.SelectedSongs[0].ID,
			Choice2:       submission.SelectedSongs[1].ID,
			Choice3:       submission.SelectedSongs[2].ID,
			Choice4:       submission.SelectedSongs[3].ID,
			Choice5:       submission.SelectedSongs[4].ID,
			Choice6:       submission.SelectedSongs[5].ID,
			Choice7:       submission.SelectedSongs[6].ID,
			Choice8:       submission.SelectedSongs[7].ID,
			Choice9:       submission.SelectedSongs[8].ID,
			Choice10:      submission.SelectedSongs[9].ID,
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
		})

		if err != nil {
			resp["msg"] = "Couldn't update the playlist"
			resp["err"] = err.Error()

			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		utils.JSON(w, http.StatusOK, resp)
	}
}
