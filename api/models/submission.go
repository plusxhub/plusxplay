package models
	
type Submission struct {
	SelectedSongs []struct {
		ID      string `json:"id,omitempty"`
		Name    string `json:"name,omitempty"`
		Artists []struct {
			Name string `json:"name,omitempty"`
			ID   string `json:"id,omitempty"`
		} `json:"artists,omitempty"`
		ReleaseDate string `json:"release_date,omitempty"`
		Image       string `json:"image,omitempty"`
		PreviewURL  string `json:"preview_url,omitempty"`
	} `json:"selectedSongs,omitempty"`
}

