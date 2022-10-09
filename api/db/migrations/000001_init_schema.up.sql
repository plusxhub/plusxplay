CREATE TABLE IF NOT EXISTS spotify_tokens (
  id BIGSERIAL PRIMARY KEY,
  spotify_user_id VARCHAR(300) NOT NULL UNIQUE, 
  created_at TIMESTAMP NOT NULL,
  refresh_token VARCHAR(300) NOT NULL,
  access_token VARCHAR(300) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  token_type VARCHAR(150) NOT NULL
);


CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  display_name VARCHAR(400) NOT NULL,
  spotify_id VARCHAR(300) NOT NULL UNIQUE,
  country VARCHAR(100),
  image_url TEXT,
  choices VARCHAR(300)[] 
);

CREATE TABLE songs (
	id BIGSERIAL PRIMARY KEY,
  spotify_id VARCHAR(300) NOT NULL UNIQUE,
  name VARCHAR(400) NOT NULL,
  artist VARCHAR(400)[] NOT NULL,
  release_date VARCHAR(100) NOT NULL,
  image VARCHAR(500),
  preview_url VARCHAR(500)
);

