-- Create the database
CREATE DATABASE daily_art_explorer;

-- Connect to the database
\connect daily_art_explorer;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Artworks table
CREATE TABLE artworks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255),
    period VARCHAR(255),
    medium VARCHAR(255),
    location VARCHAR(255),
    image_url VARCHAR(255) NOT NULL,
    met_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Likes table
CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    artwork_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
);

-- Saved artworks table
CREATE TABLE saved_artworks (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    artwork_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
);
