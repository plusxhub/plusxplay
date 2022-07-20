package handlers

import (
	"net/http"

	db "github.com/milindmadhukar/plusxplay/db/sqlc"
	"github.com/milindmadhukar/plusxplay/utils"
)

func SpotifySearchHandler(jwt_secret_key string, queries *db.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var resp map[string]interface{} = make(map[string]interface{})

		jwtToken := r.Header.Get("Token")

		spotify_id, errMsg, status := utils.GetSpotifyUserIDFromJWT(jwtToken, jwt_secret_key)
		if errMsg != "" {
			resp["error"] = errMsg
			utils.JSON(w, status, resp)
			return
		}

		token, err := queries.GetSpotifyToken(
			r.Context(),
			spotify_id,
		)
		if err != nil {
			resp["error"] = "Error getting spotify token"
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}
		query := r.URL.Query().Get("query")
		if query == "" {
			resp["error"] = "Query is empty"
			utils.JSON(w, http.StatusBadRequest, resp)
			return
		}
		tracks, err := utils.SearchTracks(token.AccessToken, query, 10)
		if err != nil {
			resp["error"] = err.Error()
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}
		utils.JSON(w, http.StatusOK, tracks)
	}
}
