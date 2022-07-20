package server

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/milindmadhukar/plusxplay/handlers"
)

// Function to handle routes
func (s *Server) HandleRoutes(mainRouter *chi.Mux) {
	mainRouter.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("PlusXPlay API!"))
	})

	authRouter := chi.NewRouter()
	authRouter.Get(
		"/url",
		handlers.GetAuthURLHandler(
			s.OauthConf,
			s.Config.API.OAuthState,
		),
	)
	authRouter.Get("/callback",
		handlers.CallbackHandler(
			s.Config.API.JWTSecretKey,
			s.Queries,
			s.OauthConf,
			s.Config.API.OAuthState,
		),
	)
	authRouter.Get("/is-authenticated",
		handlers.IsAuthenticatedHandler(
			s.Config.Spotify.ClientID,
			s.Config.Spotify.ClientSecret,
			s.Config.API.JWTSecretKey,
			s.Queries),
	)

	spotifyRouter := chi.NewRouter()
	spotifyRouter.Get("/search",
		handlers.SpotifySearchHandler(
			s.Config.API.JWTSecretKey,
			s.Queries,
		),
	)

	mainRouter.Mount("/auth", authRouter)
	mainRouter.Mount("/spotify", spotifyRouter)
}
