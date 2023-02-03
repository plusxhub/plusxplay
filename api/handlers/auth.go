package handlers

import (
	"errors"
	"net/http"
	"time"

	db "github.com/milindmadhukar/plusxplay/db/sqlc"
	"github.com/milindmadhukar/plusxplay/models"
	"github.com/milindmadhukar/plusxplay/utils"
	"github.com/rs/zerolog/log"
	"golang.org/x/oauth2"
)

func GetAuthURLHandler(oauthConf *oauth2.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		var resp map[string]interface{} = make(map[string]interface{})
		base_url := oauthConf.AuthCodeURL(models.Config.API.OAuthState)
		resp["url"] = base_url
		utils.JSON(w, http.StatusOK, resp)
	}
}

func CallbackHandler(queries *db.Queries, oauthConf *oauth2.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var resp map[string]interface{} = make(map[string]interface{})
		state := r.FormValue("state")
		if state != models.Config.API.OAuthState {
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
			resp["error"] = err.Error()
			utils.JSON(w, http.StatusUnauthorized, resp)
			return
		}

		log.Info().Msg("Callback for user: " + spotifyUser.ID)

		user, err := queries.CreateOrUpdateUser(
			r.Context(),
			db.CreateOrUpdateUserParams{
				DisplayName: spotifyUser.DisplayName,
				SpotifyID:   spotifyUser.ID,
				Country:     utils.GetNullString(spotifyUser.Country),
				ImageUrl:    utils.GetUserProfileImage(spotifyUser),
			},
		)
		if err != nil {
			resp["error"] = err.Error()
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

    log.Info().Msg("Created or updated user: " + spotifyUser.ID)

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

		err = utils.SetJWTOnCookie(user.SpotifyID, token.ExpiresAt.UTC(), now, w)
		if err != nil {
			resp["error"] = err.Error()
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

    log.Info().Msg("Set the JWT Cookie for the token.")

		http.Redirect(w, r, models.Config.API.FrontendUrl, http.StatusFound)
	}
}

func LogoutHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		var resp map[string]interface{} = make(map[string]interface{})

		err := utils.SetJWTOnCookie("69420", time.Now(), time.Now(), w)
		if err != nil {
			resp["error"] = err.Error()
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		http.Redirect(w, r, models.Config.API.FrontendUrl, http.StatusFound)
	}
}

func IsAuthenticatedHandler(queries *db.Queries) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var resp map[string]interface{} = make(map[string]interface{})
		jwtToken, err := r.Cookie("token")
		var respStatus int
		if err != nil {
			if errors.Is(err, http.ErrNoCookie) {
				resp["error"] = "No token provided"
				resp["is_authenticated"] = false
				respStatus = http.StatusUnauthorized
			} else {
				resp["error"] = err.Error()
				respStatus = http.StatusInternalServerError
			}
			utils.JSON(w, respStatus, resp)
			return
		}

		spotifyId, errMsg, status := utils.GetSpotifyUserIDFromJWT(jwtToken.Value)

		if errMsg != "" {
			resp["error"] = errMsg
			utils.JSON(w, status, resp)
			return
		}

		_, err = utils.GetOrUpdateSpotifyToken(spotifyId, queries, r.Context(), w)
		if err != nil {
			resp["error"] = err.Error()
			resp["is_authenticated"] = false
			utils.JSON(w, http.StatusUnauthorized, resp)
			return
		}

		user, err := queries.GetUser(r.Context(), spotifyId)
		if err != nil {
			resp["error"] = err.Error()
			resp["is_authenticated"] = false
			utils.JSON(w, http.StatusInternalServerError, resp)
			return
		}

		resp["is_authenticated"] = true
		resp["is_admin"] = utils.IsAdmin(spotifyId)
		resp["user"] = user
		utils.JSON(w, http.StatusOK, resp)
	}
}

func IsAdminHandler() http.HandlerFunc {
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

		resp["is_admin"] = utils.IsAdmin(spotifyId)
		utils.JSON(w, http.StatusOK, resp)
	}
}
