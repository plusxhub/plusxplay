package utils

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"net/url"
	"strings"
	"time"

	db "github.com/milindmadhukar/plusxplay/db/sqlc"
	"github.com/milindmadhukar/plusxplay/models"
	"github.com/rs/zerolog/log"
)

const baseURL = "https://api.spotify.com/v1/"

func ExecuteSpotifyRequest(endpoint, httpMethod string, body *[]byte, access_token string, resp interface{}) error {

	url := baseURL + endpoint

	var bodyReader io.Reader

	if body != nil {
		bodyReader = bytes.NewBuffer(*body)
	}

	req, err := http.NewRequest(httpMethod, url, bodyReader)
	if err != nil {
		return err
	}

	req.Header.Add("Authorization", "Bearer "+access_token)
	req.Header.Add("Content-Type", "application/json")

	spotifyResp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer spotifyResp.Body.Close()

	bodyBytes, err := io.ReadAll(spotifyResp.Body)
	if err != nil {
		log.Warn().Msg(err.Error())
	}
	bodyString := string(bodyBytes)
	log.Info().Msg("Response from Spotify: " + bodyString)

	spotifyResp.Body = ioutil.NopCloser(bytes.NewBuffer(bodyBytes))

	if err := json.NewDecoder(spotifyResp.Body).Decode(resp); err != nil {
		//TODO: Use the error model to send the required error.
		return errors.New("No valid results found.")
	}

	return nil
}

func RefreshSpotifyToken(refresh_token string) (*db.CreateOrUpdateSpotifyTokensParams, error) {
	reqBody := url.Values{
		"grant_type":    {"refresh_token"},
		"refresh_token": {refresh_token},
		"client_id":     {models.Config.Spotify.ClientID},
		"client_secret": {models.Config.Spotify.ClientSecret},
	}
	req, err := http.NewRequest("POST", "https://accounts.spotify.com/api/token", strings.NewReader(reqBody.Encode()))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	spotifyResp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer spotifyResp.Body.Close()

	// bodyBytes, err := io.ReadAll(spotifyResp.Body)
	// if err != nil {
	// 	log.Warn().Msg(err.Error())
	// }
	// bodyString := string(bodyBytes)
	// fmt.Println("Refresh response from Spotify: " + bodyString)
	//
	// spotifyResp.Body = ioutil.NopCloser(bytes.NewBuffer(bodyBytes))

	var spotifyRespBody models.SpotifyAuthResponse
	if err := json.NewDecoder(spotifyResp.Body).Decode(&spotifyRespBody); err != nil {
		return nil, err
	}

  fmt.Println(spotifyRespBody.AccessToken == "", spotifyRespBody.RefreshToken == "", spotifyRespBody.TokenType == "")

	if spotifyRespBody.AccessToken == "" || spotifyRespBody.TokenType == "" {
		return nil, errors.New("Access Tokens/ Token Type was not recieved from Spotify.")
	}
  
  if spotifyRespBody.RefreshToken == "" {
    spotifyRespBody.RefreshToken = refresh_token
  }

	return &db.CreateOrUpdateSpotifyTokensParams{
		CreatedAt:    time.Now().UTC(),
		RefreshToken: spotifyRespBody.RefreshToken,
		AccessToken:  spotifyRespBody.AccessToken,
		ExpiresAt:    time.Now().UTC().Add(time.Second * time.Duration(spotifyRespBody.ExpiresIn)),
		TokenType:    spotifyRespBody.TokenType,
	}, nil
}

func GetOrUpdateSpotifyToken(spotifyId string, queries *db.Queries, ctx context.Context, w http.ResponseWriter) (*db.SpotifyToken, error) {

	token, err := queries.GetSpotifyToken(
		ctx, spotifyId,
	)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, errors.New("No such user exists.")
	}
	if err != nil {
		return nil, err
	}

	if time.Now().UTC().After(token.ExpiresAt) {
		if token.RefreshToken == "" {
			log.Warn().Msg("Refresh token is empty.")
			return nil, errors.New("Refresh token is empty.")
		}

		updateParams, err := RefreshSpotifyToken(token.RefreshToken)
		if err != nil {
			return nil, err
		}
		updateParams.SpotifyUserID = spotifyId

		token, err = queries.CreateOrUpdateSpotifyTokens(
			ctx,
			*updateParams,
		)

		if err != nil {
			return nil, err
		}
	}

	return &token, nil

}

func SearchTracks(accessToken, query string, limit int) (*[]models.SpotifyTrack, error) {

	var spotifySearchResponse models.SpotifySearchResponse
	endpoint := fmt.Sprintf(
		"search?type=track&limit=%d&q=%s&min_danceability=%f",
		limit,
		strings.ReplaceAll(query, " ", "+"),
		0.15,
	)
	if err := ExecuteSpotifyRequest(endpoint, http.MethodGet, nil, accessToken, &spotifySearchResponse); err != nil {
		return nil, err
	}

	var tracks []models.SpotifyTrack

	for _, item := range spotifySearchResponse.Tracks.Items {
		track := models.SpotifyTrack{
			ID:          item.ID,
			Name:        item.Name,
			Artists:     getSpotifyArtists(item.Artists),
			ReleaseDate: item.Album.ReleaseDate,
			Image:       item.Album.Images[1].URL,
			PreviewURL:  item.PreviewURL,
		}
		tracks = append(tracks, track)
	}

	return &tracks, nil
}

func GetRecommendedTracks(accessToken string, limit int) (*[]models.SpotifyTrack, error) {

	var spotifySearchResponse models.SpotifyRecommendationsResponse
	endpoint := fmt.Sprintf("recommendations?limit=%d&seed_artists=%s", limit, "60d24wfXkVzDSfLS6hyCjZ")
	if err := ExecuteSpotifyRequest(endpoint, http.MethodGet, nil, accessToken, &spotifySearchResponse); err != nil {
		return nil, err
	}

	var tracks []models.SpotifyTrack

	for _, item := range spotifySearchResponse.Tracks {
		track := models.SpotifyTrack{
			ID:          item.ID,
			Name:        item.Name,
			Artists:     getSpotifyArtists(item.Artists),
			ReleaseDate: item.Album.ReleaseDate,
			Image:       item.Album.Images[1].URL,
			PreviewURL:  item.PreviewURL,
		}
		tracks = append(tracks, track)
	}

	return &tracks, nil
}

func GetSpotifySongs(accessToken string, songIDs []string) (*[]models.SpotifyTrack, error) {

	var spotifySearchResponse models.SpotifySeveralTracksRespponse
	endpoint := fmt.Sprintf("tracks?ids=%s", strings.Join(songIDs, ","))
	if err := ExecuteSpotifyRequest(endpoint, http.MethodGet, nil, accessToken, &spotifySearchResponse); err != nil {
		return nil, err
	}

	var tracks []models.SpotifyTrack

	for _, item := range spotifySearchResponse.Tracks {
		track := models.SpotifyTrack{
			ID:          item.ID,
			Name:        item.Name,
			Artists:     getSpotifyArtists(item.Artists),
			ReleaseDate: item.Album.ReleaseDate,
			Image:       item.Album.Images[1].URL,
			PreviewURL:  item.PreviewURL,
		}
		tracks = append(tracks, track)
	}

	return &tracks, nil
}

func SetPlaylist(accessToken string, songIDs []string) error {
	if err := clearPlaylistSongs(accessToken); err != nil {
		return err
	}

	var spotifyAddResponse models.SpotifyUpdatePlaylistItemsResponse

	requestBody := struct {
		Uris []string `json:"uris"`
	}{}

	for _, songID := range songIDs {
		requestBody.Uris = append(requestBody.Uris, "spotify:track:"+songID)
	}

	jsonValue, _ := json.Marshal(requestBody)

	endpoint := fmt.Sprintf("playlists/%s/tracks", models.Config.Spotify.TargetPlaylist)
	if err := ExecuteSpotifyRequest(endpoint, http.MethodPost, &jsonValue, accessToken, &spotifyAddResponse); err != nil {
		return err
	}

	return nil
}

func clearPlaylistSongs(accessToken string) error {

	var uris []string

	playlistItems, err := getPlaylistSongs(accessToken)
	if err != nil {
		return err
	}

	for _, item := range *playlistItems {
		uris = append(uris, item.URI)
	}

	var spotifyDeleteResponse models.SpotifyUpdatePlaylistItemsResponse

	requestBody := models.DeletePlaylistItemsBody{
		Tracks: []struct {
			URI string "json:\"uri\""
		}{},
	}

	for _, uri := range uris {
		uriStruct := struct {
			URI string "json:\"uri\""
		}{uri}
		requestBody.Tracks = append(requestBody.Tracks, uriStruct)
	}

	jsonValue, _ := json.Marshal(requestBody)

	endpoint := fmt.Sprintf("playlists/%s/tracks", models.Config.Spotify.TargetPlaylist)
	err = ExecuteSpotifyRequest(endpoint, http.MethodDelete, &jsonValue, accessToken, &spotifyDeleteResponse)

	if err != nil {
		return err
	}

	return nil
}

func getPlaylistSongs(accessToken string) (*[]models.PlaylistItem, error) {

	var spotifySearchResponse models.SpotifyGetPlaylistItemsResponse
	endpoint := fmt.Sprintf("playlists/%s/tracks", models.Config.Spotify.TargetPlaylist)
	if err := ExecuteSpotifyRequest(endpoint, http.MethodGet, nil, accessToken, &spotifySearchResponse); err != nil {
		return nil, err
	}

	var playlistItems []models.PlaylistItem

	for _, item := range spotifySearchResponse.Items {
		track := models.PlaylistItem{
			ID:          item.Track.ID,
			Name:        item.Track.Name,
			Artists:     getSpotifyArtists(item.Track.Artists),
			ReleaseDate: item.Track.Album.ReleaseDate,
			Image:       item.Track.Album.Images[1].URL,
			PreviewUrl:  item.Track.PreviewURL,
			URI:         item.Track.URI,
			AddedAt:     item.AddedAt,
			AddedBy:     item.AddedBy.ID,
		}

		playlistItems = append(playlistItems, track)
	}

	return &playlistItems, nil
}

func getSpotifyArtists(artists []models.SpotifyArtistResponse) []models.SpotifyArtist {

	var spotifyArtists []models.SpotifyArtist

	for _, artist := range artists {
		spotifyArtist := models.SpotifyArtist{
			ID:   artist.ID,
			Name: artist.Name,
		}
		spotifyArtists = append(spotifyArtists, spotifyArtist)
	}
	return spotifyArtists
}
