package server

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/milindmadhukar/plusxplay/handlers"
	"github.com/milindmadhukar/plusxplay/models"
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
			models.Config.API.OAuthState,
		),
	)
	authRouter.Get("/callback",
		handlers.CallbackHandler(
			models.Config.API.JWTSecretKey,
			s.Queries,
			s.OauthConf,
			models.Config.API.OAuthState,
		),
	)
	authRouter.Get("/is-authenticated",
		handlers.IsAuthenticatedHandler(s.Queries),
	)

	spotifyRouter := chi.NewRouter()
	spotifyRouter.Get("/search",
		handlers.SpotifySearchHandler(
			models.Config.API.JWTSecretKey,
			s.Queries,
		),
	)

	mainRouter.Mount("/auth", authRouter)
	mainRouter.Mount("/spotify", spotifyRouter)
}
