package utils

import "github.com/milindmadhukar/plusxplay/models"

func IsAdmin(spotifyId string) bool {
		isAdmin := false

		for _, id := range models.Config.API.AdminIDs {
			if id == spotifyId {
				isAdmin = true
				break
			}
		}
  return isAdmin
}
