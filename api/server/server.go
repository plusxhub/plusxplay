package server

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/milindmadhukar/plusxplay/models"
	"github.com/milindmadhukar/plusxplay/utils"
	"golang.org/x/oauth2"
	spotifyOauth "golang.org/x/oauth2/spotify"

	db "github.com/milindmadhukar/plusxplay/db/sqlc"

	_ "github.com/jackc/pgx/v4/stdlib"
)

type Server struct {
	Config    *models.Config
	Router    *chi.Mux
	Queries   *db.Queries
	DB        *sql.DB
	OauthConf *oauth2.Config
}

func New() *Server {
	s := &Server{}
	config, err := utils.LoadConfig("./configs", "config", "yml")
	if err != nil {
		log.Fatal(err)
	}
	s.Config = config

	if err := s.PrepareDB(); err != nil {
		log.Fatal(err.Error())
	}
	s.PrepareOauth2()
	s.PrepareRouter()

	return s
}
func (s *Server) PrepareDB() error {
	tries := 5
	DB, err := sql.Open("pgx", s.Config.Database.URI())
	if err != nil {
		return nil
	}

	for tries > 0 {
		log.Println("Attempting to make a connection to the garrix database...")
		err = DB.Ping()
		if err != nil {
			tries -= 1
			log.Println(err, "Could not connect. Retrying...")
			time.Sleep(8 * time.Second)
			continue
		}
		s.Queries = db.New(DB)
		s.DB = DB
		log.Println("Connection to the garrix database established.")
		return nil
	}
	return errors.New("Could not make a connection to the database.")
}

func (s *Server) PrepareRouter() {
	r := chi.NewRouter()
	//Use Global Middlewares Here
	r.Use(middleware.Logger)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: false,
		MaxAge:           300,
	}))
	//Store Router in Struct
	s.Router = r
}

func (s *Server) PrepareOauth2() {
	s.OauthConf = &oauth2.Config{
		RedirectURL:  s.Config.Spotify.RedirectURI,
		ClientID:     s.Config.Spotify.ClientID,
		ClientSecret: s.Config.Spotify.ClientSecret,
		Scopes:       []string{"user-read-private"},
		Endpoint:     spotifyOauth.Endpoint,
	}
}

func (s *Server) RunServer() (err error) {

	apiRouter := chi.NewRouter()
	s.HandleRoutes(apiRouter)
	s.Router.Mount("/api", apiRouter)

	log.Printf("Starting Server at %s:%s", s.Config.API.Host, s.Config.API.Port)
	err = http.ListenAndServe(fmt.Sprintf("%s:%s", s.Config.API.Host, s.Config.API.Port), s.Router)
	if err != nil {
		log.Fatal(err)
	}

	return
}
