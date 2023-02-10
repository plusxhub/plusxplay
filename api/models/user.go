package models

import "encoding/json"

type UserInfoSpotifyResponse struct {
	Country         string `json:"country"`
	DisplayName     string `json:"display_name"`
	ExplicitContent struct {
		FilterEnabled bool `json:"filter_enabled"`
		FilterLocked  bool `json:"filter_locked"`
	} `json:"explicit_content"`
	ExternalUrls struct {
		Spotify string `json:"spotify"`
	} `json:"external_urls"`
	Followers struct {
		Href  json.RawMessage `json:"href"`
		Total int             `json:"total"`
	} `json:"followers"`
	Href   string `json:"href"`
	ID     string `json:"id"`
	Images []struct {
		Height json.RawMessage `json:"height"`
		URL    string          `json:"url"`
		Width  json.RawMessage `json:"width"`
	} `json:"images"`
	Product string `json:"product"`
	Type    string `json:"type"`
	URI     string `json:"uri"`
}
