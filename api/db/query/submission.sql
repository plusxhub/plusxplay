-- name: CreateOrUpdatePlaylist :one
INSERT INTO user_playlists (
  spotify_user_id, 
  choice1, 
  choice2,
  choice3,
  choice4,
  choice5,
  choice6,
  choice7,
  choice8,
  choice9,
  choice10,
  created_at,
  updated_at
) VALUES (
  $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
) 
ON CONFLICT(spotify_user_id)
DO UPDATE 
SET choice1 = $2,
    choice2 = $3,
    choice3 = $4,
    choice4 = $5,
    choice5 = $6,
    choice6 = $7,
    choice7 = $8,
    choice8 = $9,
    choice9 = $10,
    choice10 = $11,
    updated_at = $13
RETURNING *;

-- name: GetPlaylist :one
SELECT * FROM user_playlists
WHERE spotify_user_id = $1
LIMIT 1;
