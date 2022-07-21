package handlers

import (
	"net/http"

	db "github.com/milindmadhukar/plusxplay/db/sqlc"
	"github.com/milindmadhukar/plusxplay/utils"
)

func SpotifySearchHandler(jwt_secret_key string, queries *db.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var resp map[string]interface{} = make(map[string]interface{})

    jwtTokenCookie, err := r.Cookie("token")

    if err != nil {
      resp["error"] = "No token found"
      utils.JSON(w, http.StatusUnauthorized, resp)
      return
    }

		spotifyId, errMsg, status := utils.GetSpotifyUserIDFromJWT(jwtTokenCookie.Value, jwt_secret_key)
		if errMsg != "" {
			resp["error"] = errMsg
			utils.JSON(w, status, resp)
			return
		}

		token, err := utils.GetOrUpdateSpotifyToken(spotifyId, queries, r.Context())

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
