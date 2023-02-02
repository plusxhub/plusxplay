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
		),
	)

	authRouter.Get("/callback",
		handlers.CallbackHandler(
			s.Queries,
			s.OauthConf,
		),
	)

	authRouter.Get("/logout",
		handlers.LogoutHandler(),
	)

	authRouter.Get("/is-authenticated",
		handlers.IsAuthenticatedHandler(s.Queries),
	)

	adminAuthRouter := chi.NewRouter()

	adminAuthRouter.Get(
		"/url",
		handlers.GetAuthURLHandler(
			s.AdminOauthConf,
		),
	)

	spotifyRouter := chi.NewRouter()
	spotifyRouter.Get("/search",
		handlers.SpotifySearchHandler(
			s.Queries,
		),
	)

	spotifyRouter.Get("/recommend",
		handlers.SpotifyRecommendationsHandler(
			s.Queries,
		),
	)

	spotifyRouter.Get("/playlist/{userSpotifyId}",
		handlers.GetUserPlaylistHandler(s.Queries),
	)

	spotifyRouter.Get("/playlist/set/{userSpotifyId}",
		handlers.SetPlaylistHandler(s.Queries),
	)

	mainRouter.Post("/submit-playlist",
		handlers.SubmitPlaylistHandlers(s.Queries),
	)

	mainRouter.Mount("/auth", authRouter)
	mainRouter.Mount("/admin", adminAuthRouter)
	mainRouter.Mount("/spotify", spotifyRouter)
}
