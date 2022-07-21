package handlers

import (
	"errors"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt"
	db "github.com/milindmadhukar/plusxplay/db/sqlc"
	"github.com/milindmadhukar/plusxplay/models"
	"github.com/milindmadhukar/plusxplay/utils"
	"golang.org/x/oauth2"
)

func GetAuthURLHandler(oauthConf *oauth2.Config, oAuthState string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		var resp map[string]interface{} = make(map[string]interface{})
		base_url := oauthConf.AuthCodeURL(oAuthState)
		req, err := http.NewRequest("GET", base_url, nil)
		if err != nil {
			resp["error"] = err.Error()
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		q := req.URL.Query()
		req.URL.RawQuery = q.Encode()
		resp["url"] = req.URL.String()
		utils.JSON(w, http.StatusOK, resp)
	}
}

func CallbackHandler(jwtSecretKey string, queries *db.Queries, oauthConf *oauth2.Config, oAuthState string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var resp map[string]interface{} = make(map[string]interface{})
		state := r.FormValue("state")
		if state != oAuthState {
			resp["error"] = "Invalid state"
			utils.JSON(w, http.StatusBadRequest, resp)
			return
		}
		code := r.FormValue("code")
		spotifyTokens, err := oauthConf.Exchange(r.Context(),
			code,
			oauth2.SetAuthURLParam("client_id", oauthConf.ClientID),
			oauth2.SetAuthURLParam("client_secret", oauthConf.ClientSecret),
		)
		if err != nil {
			resp["error"] = err.Error()
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		spotifyUser, err := utils.GetSpotifyUser(spotifyTokens.AccessToken)

		if err != nil {
			resp["error"] = "No such user exists."
			utils.JSON(w, http.StatusUnauthorized, resp)
			return
		}

		user, err := queries.CreateOrUpdateUser(
			r.Context(),
			db.CreateOrUpdateUserParams{
				DisplayName: spotifyUser.DisplayName,
				SpotifyID:   spotifyUser.ID,
				Country:     utils.GetNullString(spotifyUser.Country),
				ImageUrl:    utils.GetNullString(spotifyUser.Images[0].URL),
			},
		)
		if err != nil {
			resp["error"] = err.Error()
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		now := time.Now().UTC()

		token, err := queries.CreateOrUpdateSpotifyTokens(
			r.Context(),
			db.CreateOrUpdateSpotifyTokensParams{
				SpotifyUserID: user.SpotifyID,
				CreatedAt:     now,
				RefreshToken:  spotifyTokens.RefreshToken,
				AccessToken:   spotifyTokens.AccessToken,
				ExpiresAt:     spotifyTokens.Expiry.UTC(),
				TokenType:     spotifyTokens.TokenType,
			},
		)

		if err != nil {
			resp["error"] = "Error while creating spotify token. " + err.Error()
			utils.JSON(w, http.StatusUnauthorized, resp)
			return
		}

		jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"spotify_id": user.SpotifyID,
			"exp":        token.ExpiresAt.Unix(),
			"iat":        now.Unix(),
		})

		signedToken, err := jwtToken.SignedString([]byte(jwtSecretKey))
		if err != nil {
			resp["error"] = err.Error()
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		http.SetCookie(w, &http.Cookie{
			Name:     "token",
			Value:    signedToken,
			Path:     "/",
			Expires:  time.Now().UTC().Add(time.Hour * 24 * 7),
			Secure:   false,
			HttpOnly: true,
			SameSite: http.SameSiteLaxMode,
		})

		http.Redirect(w, r, "http://localhost:3000", http.StatusFound)
	}
}

func IsAuthenticatedHandler(queries *db.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var resp map[string]interface{} = make(map[string]interface{})
		jwtToken, err := r.Cookie("token")
		var respStatus int
		if err != nil {
			if errors.Is(err, http.ErrNoCookie) {
				resp["is_authenticated"] = false
				respStatus = http.StatusUnauthorized
			} else {
				resp["error"] = err.Error()
				respStatus = http.StatusInternalServerError

			}
			utils.JSON(w, respStatus, resp)
			return
		}

		spotifyId, errMsg, status := utils.GetSpotifyUserIDFromJWT(jwtToken.Value, models.Config.API.JWTSecretKey)

		if errMsg != "" {
			resp["error"] = errMsg
			utils.JSON(w, status, resp)
			return
		}

    _, err = utils.GetOrUpdateSpotifyToken(spotifyId, queries, r.Context())
    if err != nil {
      resp["error"] = err.Error()
      resp["is_authenticated"] = false
      utils.JSON(w, http.StatusUnauthorized, resp)
      return
    }

		resp["is_authenticated"] = true
		utils.JSON(w, http.StatusOK, resp)
	}
}
