package models

import "time"

type SpotifyArtist struct {
	Name string `json:"name"`
	ID   string `json:"id"`
}

type SpotifyTrack struct {
	ID          string          `json:"id"`
	Name        string          `json:"name"`
	Artists     []SpotifyArtist `json:"artists"`
	ReleaseDate string          `json:"release_date"`
	Image       string          `json:"image"`
	PreviewURL  string          `json:"preview_url"`
}

type PlaylistItem struct {
	ID          string          `json:"id"`
	Name        string          `json:"name"`
	Artists     []SpotifyArtist `json:"artists"`
	ReleaseDate string          `json:"release_date"`
	Image       string          `json:"image"`
	PreviewUrl  string          `json:"preview_url"`
	URI         string          `json:"uri"`
	AddedAt     time.Time       `json:"added_at"`
	AddedBy     string          `json:"added_by"`
}

type DeletePlaylistItemsBody struct {
	Tracks []struct {
		URI string `json:"uri"`
	} `json:"tracks"`
}
