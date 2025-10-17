-- ==========================================
-- DATABASE: TorneoLive
-- ==========================================
CREATE DATABASE IF NOT EXISTS TorneoLive;
USE TorneoLive;

-- ==========================================
-- TABELLE PRINCIPALI
-- ==========================================

-- Tornei
CREATE TABLE IF NOT EXISTS tournaments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Squadre
CREATE TABLE IF NOT EXISTS teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Giocatori
CREATE TABLE IF NOT EXISTS players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);

-- Iscrizioni ai tornei
CREATE TABLE IF NOT EXISTS tournament_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tournament_id INT NOT NULL,
    team_id INT NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    UNIQUE KEY unique_team_tournament (tournament_id, team_id)
);

-- Partite
CREATE TABLE IF NOT EXISTS matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tournament_id INT NOT NULL,
    team1_id INT NOT NULL,
    team2_id INT NOT NULL,
    match_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
    FOREIGN KEY (team1_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (team2_id) REFERENCES teams(id) ON DELETE CASCADE
);

-- Punteggi
CREATE TABLE IF NOT EXISTS scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    match_id INT NOT NULL,
    team_id INT NOT NULL,
    points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);

-- ==========================================
-- OPTIONAL: VIEWS
-- ==========================================

-- Classifica di un torneo
DROP VIEW IF EXISTS tournament_leaderboard;
CREATE VIEW tournament_leaderboard AS
SELECT t.id AS team_id, t.name AS team_name, tr.tournament_id,
       SUM(s.points) AS total_points
FROM teams t
JOIN tournament_registrations tr ON t.id = tr.team_id
LEFT JOIN matches m ON (m.team1_id = t.id OR m.team2_id = t.id)
LEFT JOIN scores s ON s.match_id = m.id AND s.team_id = t.id
GROUP BY t.id, tr.tournament_id;

-- Dettaglio partita con squadre e punteggi
DROP VIEW IF EXISTS match_details;
CREATE VIEW match_details AS
SELECT m.id AS match_id, m.tournament_id, 
       t1.name AS team1_name, t2.name AS team2_name,
       s1.points AS team1_points, s2.points AS team2_points,
       m.match_date
FROM matches m
LEFT JOIN teams t1 ON m.team1_id = t1.id
LEFT JOIN teams t2 ON m.team2_id = t2.id
LEFT JOIN scores s1 ON s1.match_id = m.id AND s1.team_id = m.team1_id
LEFT JOIN scores s2 ON s2.match_id = m.id AND s2.team_id = m.team2_id;

-- ==========================================
-- DATI DI ESEMPIO (opzionale)
-- ==========================================
INSERT INTO tournaments (name, start_date, end_date) VALUES 
('Torneo Estivo', '2025-06-01', '2025-06-30'),
('Torneo Invernale', '2025-12-01', '2025-12-31');

INSERT INTO teams (name) VALUES 
('Squadra A'), ('Squadra B'), ('Squadra C');

INSERT INTO players (team_id, name, position) VALUES
(1, 'Giocatore 1', 'Attaccante'),
(1, 'Giocatore 2', 'Difensore'),
(2, 'Giocatore 3', 'Centrocampista'),
(3, 'Giocatore 4', 'Portiere');

INSERT INTO tournament_registrations (tournament_id, team_id) VALUES
(1, 1), (1, 2), (1, 3),
(2, 1), (2, 3);

INSERT INTO matches (tournament_id, team1_id, team2_id, match_date) VALUES
(1, 1, 2, '2025-06-05 15:00:00'),
(1, 2, 3, '2025-06-06 17:00:00'),
(2, 1, 3, '2025-12-05 16:00:00');

INSERT INTO scores (match_id, team_id, points) VALUES
(1, 1, 3), (1, 2, 1),
(2, 2, 2), (2, 3, 3),
(3, 1, 1), (3, 3, 2);
