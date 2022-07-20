package utils

import "github.com/milindmadhukar/plusxplay/models"

func GetSpotifyUser(access_token string) (user *models.UserInfoSpotifyResponse, err error) {
	err = ExecuteSpotifyRequest("me", access_token, &user)
	if err != nil {
		return nil, err
	}
	return user, nil
}
