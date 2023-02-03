-- name: CreateOrUpdateUser :one
INSERT INTO users (
  display_name,
  spotify_id,
  country,
  image_url
) VALUES (
  $1,$2,$3,$4
) 
ON CONFLICT (spotify_id)
DO UPDATE 
SET display_name = $1,
    country = $3,
    image_url = $4
RETURNING * ;

-- name: GetUser :one
SELECT * FROM users 
WHERE spotify_id = $1
LIMIT 1;
