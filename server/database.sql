
BEGIN;


CREATE TABLE IF NOT EXISTS public."Users"
(
    id bigint NOT NULL,
    email character varying(50) NOT NULL,
    firstname character varying(50) NOT NULL,
    lastname character varying(50) NOT NULL,
    password_hash character varying(50) NOT NULL,
    created_at timestamp without time zone,
    PRIMARY KEY (id),
    UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS public."Reviews"
(
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    movie_id bigint NOT NULL,
    rating smallint,
    review_text text,
    created_at timestamp without time zone,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public."Favourite_lists"
(
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    name character varying(50),
    created_at timestamp without time zone,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public."Favourite_movies"
(
    id bigint NOT NULL,
    favourite_id bigint NOT NULL,
    movie_id bigint NOT NULL,
    genre character varying,
    added_at timestamp without time zone,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public."Group_members"
(
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    group_id bigint NOT NULL,
    role character varying(10),
    joined_at timestamp without time zone,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public."Groups"
(
    id bigint NOT NULL,
    name character varying,
    created_by bigint,
    created_at timestamp without time zone,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public."Group_movies"
(
    id bigint NOT NULL,
    group_id bigint NOT NULL,
    movie_id bigint NOT NULL,
    genre character varying(50),
    added_at timestamp without time zone,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public."Group_join_requests"
(
    id bigint NOT NULL,
    group_id bigint NOT NULL,
    requester_id bigint,
    status character varying,
    created_at timestamp without time zone,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public."Reviews"
    ADD FOREIGN KEY (user_id)
    REFERENCES public."Users" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public."Favourite_lists"
    ADD FOREIGN KEY (user_id)
    REFERENCES public."Users" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public."Favourite_movies"
    ADD FOREIGN KEY (favourite_id)
    REFERENCES public."Favourite_lists" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public."Group_members"
    ADD FOREIGN KEY (user_id)
    REFERENCES public."Users" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public."Groups"
    ADD FOREIGN KEY (created_by)
    REFERENCES public."Group_members" (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public."Group_movies"
    ADD FOREIGN KEY (group_id)
    REFERENCES public."Groups" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public."Group_join_requests"
    ADD FOREIGN KEY (group_id)
    REFERENCES public."Groups" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

END;