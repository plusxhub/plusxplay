package handlers

import (
	"net/http"

	db "github.com/milindmadhukar/plusxplay/db/sqlc"
	"github.com/milindmadhukar/plusxplay/utils"
)

func SubmitPlaylistHandlers(queries *db.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var resp map[string]interface{} = make(map[string]interface{})

		utils.JSON(w, http.StatusOK, resp)
	}
}
