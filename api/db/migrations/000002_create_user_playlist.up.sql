CREATE TABLE user_playlists (
  id SERIAL PRIMARY KEY,
  spotify_user_id VARCHAR(300) UNIQUE NOT NULL REFERENCES users(spotify_id),
  choice1 VARCHAR(100) NOT NULL,
  choice2 VARCHAR(100) NOT NULL,
  choice3 VARCHAR(100) NOT NULL,
  choice4 VARCHAR(100) NOT NULL,
  choice5 VARCHAR(100) NOT NULL,
  choice6 VARCHAR(100) NOT NULL,
  choice7 VARCHAR(100) NOT NULL,
  choice8 VARCHAR(100) NOT NULL,
  choice9 VARCHAR(100) NOT NULL,
  choice10 VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
