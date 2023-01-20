CREATE TABLE user_playlist (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  choice1 VARCHAR(100),
  choice2 VARCHAR(100),
  choice3 VARCHAR(100),
  choice4 VARCHAR(100),
  choice5 VARCHAR(100),
  choice6 VARCHAR(100),
  choice7 VARCHAR(100),
  choice8 VARCHAR(100),
  choice9 VARCHAR(100),
  choice10 VARCHAR(100),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
