package utils

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"

	db "github.com/milindmadhukar/plusxplay/db/sqlc"
	"github.com/milindmadhukar/plusxplay/models"
)

const baseURL = "https://api.spotify.com/v1/"

func ExecuteSpotifyRequest(endpoint, access_token string, resp interface{}) error {

	url := baseURL + endpoint
	req, err := http.NewRequest("GET", url, nil)
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

	// bodyBytes, err := io.ReadAll(spotifyResp.Body)
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// bodyString := string(bodyBytes)
	// log.Println("Response from spotify", bodyString)

	if err := json.NewDecoder(spotifyResp.Body).Decode(resp); err != nil {
		//TODO: Use the error model to send the required error.
		return errors.New("No valid search results found.")
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

	var spotifyRespBody models.SpotifyAuthResponse
	if err := json.NewDecoder(spotifyResp.Body).Decode(&spotifyRespBody); err != nil {
		return nil, err
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
    log.Println("Refreshing token")
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
      
      err = SetJWTOnCookie(token.SpotifyUserID, token.ExpiresAt.UTC(), time.Now().UTC(), w)
      if err != nil {
        return nil, err
      }
		}

  return &token, nil

}

func SearchTracks(access_token, query string, limit int) (*[]models.SpotifyTrack, error) {

	var spotifySearchResponse models.SpotifySearchResponse
	endpoint := fmt.Sprintf("search?type=track&limit=%d&q=%s", limit, strings.ReplaceAll(query, " ", "+"))
	if err := ExecuteSpotifyRequest(endpoint, access_token, &spotifySearchResponse); err != nil {
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
			PreviewURl:  item.PreviewURL,
		}
		tracks = append(tracks, track)
	}

	return &tracks, nil
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
