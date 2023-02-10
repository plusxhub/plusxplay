package utils

import (
	"database/sql"
	"time"

	"github.com/milindmadhukar/plusxplay/models"
)

func GetNullString(s string) sql.NullString {
	if s == "" {
		return sql.NullString{}
	}
	return sql.NullString{
		String: s,
		Valid:  true,
	}
}

func GetUserProfileImage(userInfo *models.UserInfoSpotifyResponse) sql.NullString {
  if len(userInfo.Images) == 0 {
		return sql.NullString{}
  }

	return sql.NullString{
		String: userInfo.Images[0].URL,
		Valid:  true,
	}

}

func GetNullTime(t time.Time) sql.NullTime {
	if t.IsZero() {
		return sql.NullTime{}
	}
	return sql.NullTime{
		Time:  t,
		Valid: true,
	}
}
