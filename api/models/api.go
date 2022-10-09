package models

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
	PreviewURl  string          `json:"preview_url"`
}
