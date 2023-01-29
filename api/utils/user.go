package utils

import (
	"net/http"

	"github.com/milindmadhukar/plusxplay/models"
)

func GetSpotifyUser(access_token string) (user *models.UserInfoSpotifyResponse, err error) {
	err = ExecuteSpotifyRequest("me", http.MethodGet, nil, access_token, &user)
	if err != nil {
		return nil, err
	}
	return user, nil
}
