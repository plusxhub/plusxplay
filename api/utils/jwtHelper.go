package utils

import (
	"fmt"
	"net/http"

	"github.com/golang-jwt/jwt"
)

func IsJWTValid(jwtToken, jwt_secret_key string) (valid bool, claims jwt.MapClaims, err error) {
	token, err := jwt.Parse(jwtToken, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return []byte(jwt_secret_key), nil
	})

	if err != nil {
		return false, nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return true, claims, nil
	} else {
		return false, nil, err
	}
}

func GetSpotifyUserIDFromJWT(jwtToken, jwt_secret_key string) (spotifyUserID, errMsg string, status int) {
	if jwtToken == "" {
		return "", "No token provided", http.StatusBadRequest
	}
	valid, claims, err := IsJWTValid(jwtToken, jwt_secret_key)
	if err != nil {
		return "", err.Error(), http.StatusBadRequest
	}
	if !valid {
		return "", "Invalid token", http.StatusUnauthorized
	}
	spotify_id, ok := claims["spotify_id"].(string)
	if !ok {
		return "", "Invalid token", http.StatusUnauthorized
	}

	return spotify_id, "", http.StatusOK
}
