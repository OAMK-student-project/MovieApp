-- Aloita transaktio
BEGIN;

-- Pudotetaan kaikki taulut
DROP TABLE IF EXISTS "Group_join_requests" CASCADE;
DROP TABLE IF EXISTS "Group_movies" CASCADE;
DROP TABLE IF EXISTS "Group_members" CASCADE;
DROP TABLE IF EXISTS "Favourite_movies" CASCADE;
DROP TABLE IF EXISTS "Favourite_lists" CASCADE;
DROP TABLE IF EXISTS "Reviews" CASCADE;
DROP TABLE IF EXISTS "Groups" CASCADE;
DROP TABLE IF EXISTS "Users" CASCADE;

-- Luodaan Users-taulu
CREATE TABLE "Users" (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL UNIQUE,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    password_hash VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Luodaan Reviews-taulu
CREATE TABLE "Reviews" (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    movie_id BIGINT NOT NULL,
    rating SMALLINT,
    review_text TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES "Users"(id)
);

-- Luodaan Favourite_lists-taulu
CREATE TABLE "Favourite_lists" (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES "Users"(id)
);

-- Luodaan Favourite_movies-taulu
CREATE TABLE "Favourite_movies" (
    id BIGSERIAL PRIMARY KEY,
    favourite_id BIGINT NOT NULL,
    movie_id BIGINT NOT NULL,
    genre VARCHAR,
    added_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (favourite_id) REFERENCES "Favourite_lists"(id)
);

-- Luodaan Groups-taulu
CREATE TABLE "Groups" (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (created_by) REFERENCES "Users"(id)
);

-- Luodaan Group_members-taulu
CREATE TABLE "Group_members" (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    group_id BIGINT NOT NULL,
    role VARCHAR(10),
    joined_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES "Users"(id),
    FOREIGN KEY (group_id) REFERENCES "Groups"(id)
);

-- Luodaan Group_movies-taulu
CREATE TABLE "Group_movies" (
    id BIGSERIAL PRIMARY KEY,
    group_id BIGINT NOT NULL,
    movie_id BIGINT NOT NULL,
    genre VARCHAR(50),
    added_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (group_id) REFERENCES "Groups"(id)
);

-- Luodaan Group_join_requests-taulu
CREATE TABLE "Group_join_requests" (
    id BIGSERIAL PRIMARY KEY,
    group_id BIGINT NOT NULL,
    requester_id BIGINT,
    status VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (group_id) REFERENCES "Groups"(id)
);

-- Lisätään yksi testikäyttäjä
INSERT INTO "Users" (email, firstname, lastname, password_hash)
VALUES ('foo@foo.com', 'Foo', 'Bar', 'password123');

-- Lisätään 30 testiryhmää, luotu käyttäjä id=1
INSERT INTO "Groups" (name, created_by)
VALUES 
('Test Group 1', 1),
('Test Group 2', 1),
('Test Group 3', 1),
('Test Group 4', 1),
('Test Group 5', 1),
('Test Group 6', 1),
('Test Group 7', 1),
('Test Group 8', 1),
('Test Group 9', 1),
('Test Group 10', 1),
('Test Group 11', 1),
('Test Group 12', 1),
('Test Group 13', 1),
('Test Group 14', 1),
('Test Group 15', 1),
('Test Group 16', 1),
('Test Group 17', 1),
('Test Group 18', 1),
('Test Group 19', 1),
('Test Group 20', 1),
('Test Group 21', 1),
('Test Group 22', 1),
('Test Group 23', 1),
('Test Group 24', 1),
('Test Group 25', 1),
('Test Group 26', 1),
('Test Group 27', 1),
('Test Group 28', 1),
('Test Group 29', 1),
('Test Group 30', 1);

-- Lopeta transaktio
COMMIT;