package server

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/milindmadhukar/plusxplay/handlers"
)

// Function to handle routes
func (s *Server) HandleRoutes(mainRouter *chi.Mux) {

	plusxplayRouter := chi.NewRouter()
	plusxplayRouter.Get("/", func(w http.ResponseWriter, r *http.Request) {
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

	// TODO: Maybe could add a middleware to check if admin or not
	adminRouter := chi.NewRouter()

	adminRouter.Get(
		"/url",
		handlers.GetAuthURLHandler(
			s.AdminOauthConf,
		),
	)

	adminRouter.Get(
		"/random-playlist",
		handlers.SelectRandomUserHandler(
			s.Queries,
		),
	)

	adminRouter.Post(
		"/set-playlist",
		handlers.SelectWinnerHandler(
			s.Queries,
		),
	)

	adminRouter.Get(
		"/current-winner",
		handlers.GetCurrentWinnerHandler(),
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

	plusxplayRouter.Get("/playlist/{userSpotifyId}",
		handlers.GetUserPlaylistHandler(s.Queries),
	)

	plusxplayRouter.Post("/submit-playlist",
		handlers.SubmitPlaylistHandlers(s.Queries),
	)

	plusxplayRouter.Mount("/auth", authRouter)
	plusxplayRouter.Mount("/admin", adminRouter)
	plusxplayRouter.Mount("/spotify", spotifyRouter)

	mainRouter.Mount("/plusxplay", plusxplayRouter)
}
