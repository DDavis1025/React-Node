--
-- PostgreSQL database dump
--

-- Dumped from database version 12.3
-- Dumped by pg_dump version 12.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: albums; Type: TABLE; Schema: public; Owner: dillondavis
--

CREATE TABLE public.albums (
    id uuid NOT NULL,
    date date,
    description character varying(255),
    title character varying(80),
    time_added timestamp with time zone DEFAULT now(),
    author character varying(80),
    type text
);


ALTER TABLE public.albums OWNER TO dillondavis;

--
-- Name: comment_likes; Type: TABLE; Schema: public; Owner: dillondavis
--

CREATE TABLE public.comment_likes (
    comment_id text,
    user_id text,
    time_added timestamp with time zone DEFAULT now()
);


ALTER TABLE public.comment_likes OWNER TO dillondavis;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: dillondavis
--

CREATE TABLE public.comments (
    id uuid NOT NULL,
    username character varying(90),
    user_picture text,
    user_id text,
    time_added timestamp with time zone DEFAULT now(),
    text text,
    post_id text,
    like_users text,
    likes integer
);


ALTER TABLE public.comments OWNER TO dillondavis;

--
-- Name: fields; Type: TABLE; Schema: public; Owner: dillondavis
--

CREATE TABLE public.fields (
    id uuid NOT NULL,
    date date,
    description character varying(255),
    title character varying(80),
    time_added timestamp with time zone DEFAULT now(),
    author text,
    type text
);


ALTER TABLE public.fields OWNER TO dillondavis;

--
-- Name: file; Type: TABLE; Schema: public; Owner: dillondavis
--

CREATE TABLE public.file (
    image_name character varying(255),
    type character varying(100),
    size integer,
    path character varying(255),
    album_id uuid NOT NULL
);


ALTER TABLE public.file OWNER TO dillondavis;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: dillondavis
--

CREATE TABLE public.notifications (
    user_id text,
    supporter_id text,
    message text,
    post_id text,
    parent_commentid text,
    comment_id text,
    time_added timestamp with time zone DEFAULT now(),
    tableview_index smallint,
    parentsubcommentid text,
    supporter_username text,
    supporter_picture text,
    parent_comment text,
    post_image text,
    post_type text,
    new boolean
);


ALTER TABLE public.notifications OWNER TO dillondavis;

--
-- Name: post_likes; Type: TABLE; Schema: public; Owner: dillondavis
--

CREATE TABLE public.post_likes (
    user_id text,
    post_id text,
    time_added timestamp with time zone DEFAULT now(),
    type text
);


ALTER TABLE public.post_likes OWNER TO dillondavis;

--
-- Name: songs; Type: TABLE; Schema: public; Owner: me
--

CREATE TABLE public.songs (
    name character varying(200),
    link character varying(30),
    index integer,
    album_id uuid NOT NULL,
    id uuid NOT NULL,
    path character varying(255)
);


ALTER TABLE public.songs OWNER TO me;

--
-- Name: sub_comments; Type: TABLE; Schema: public; Owner: dillondavis
--

CREATE TABLE public.sub_comments (
    id uuid NOT NULL,
    username character varying(90),
    user_picture text,
    user_id text,
    time_added timestamp with time zone DEFAULT now(),
    text text,
    parent_id text,
    post_id text
);


ALTER TABLE public.sub_comments OWNER TO dillondavis;

--
-- Name: track; Type: TABLE; Schema: public; Owner: dillondavis
--

CREATE TABLE public.track (
    path text,
    id uuid,
    author text
);


ALTER TABLE public.track OWNER TO dillondavis;

--
-- Name: track_images; Type: TABLE; Schema: public; Owner: dillondavis
--

CREATE TABLE public.track_images (
    path text,
    id uuid,
    author text
);


ALTER TABLE public.track_images OWNER TO dillondavis;

--
-- Name: user_followers; Type: TABLE; Schema: public; Owner: dillondavis
--

CREATE TABLE public.user_followers (
    user_id text,
    follower_id text,
    time_added timestamp with time zone DEFAULT now()
);


ALTER TABLE public.user_followers OWNER TO dillondavis;

--
-- Name: user_images; Type: TABLE; Schema: public; Owner: dillondavis
--

CREATE TABLE public.user_images (
    image_name character varying(255),
    type character varying(100),
    size integer,
    path character varying(255),
    user_id text
);


ALTER TABLE public.user_images OWNER TO dillondavis;

--
-- Name: user_info; Type: TABLE; Schema: public; Owner: dillondavis
--

CREATE TABLE public.user_info (
    username text,
    user_id text
);


ALTER TABLE public.user_info OWNER TO dillondavis;

--
-- Name: video; Type: TABLE; Schema: public; Owner: dillondavis
--

CREATE TABLE public.video (
    path text,
    id uuid,
    author text
);


ALTER TABLE public.video OWNER TO dillondavis;

--
-- Name: video_thumbnails; Type: TABLE; Schema: public; Owner: dillondavis
--

CREATE TABLE public.video_thumbnails (
    path text,
    id uuid,
    author text
);


ALTER TABLE public.video_thumbnails OWNER TO dillondavis;

--
-- Data for Name: albums; Type: TABLE DATA; Schema: public; Owner: dillondavis
--

COPY public.albums (id, date, description, title, time_added, author, type) FROM stdin;
c65dab16-e201-425a-b57f-cd5a47ae3eee    \N  \N  Title   2020-09-14 13:24:14.415861-04   \N  \N
\.


--
-- Data for Name: comment_likes; Type: TABLE DATA; Schema: public; Owner: dillondavis
--

COPY public.comment_likes (comment_id, user_id, time_added) FROM stdin;
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: dillondavis
--

COPY public.comments (id, username, user_picture, user_id, time_added, text, post_id, like_users, likes) FROM stdin;
\.


--
-- Data for Name: fields; Type: TABLE DATA; Schema: public; Owner: dillondavis
--

COPY public.fields (id, date, description, title, time_added, author, type) FROM stdin;
\.


--
-- Data for Name: file; Type: TABLE DATA; Schema: public; Owner: dillondavis
--

COPY public.file (image_name, type, size, path, album_id) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: dillondavis
--

COPY public.notifications (user_id, supporter_id, message, post_id, parent_commentid, comment_id, time_added, tableview_index, parentsubcommentid, supporter_username, supporter_picture, parent_comment, post_image, post_type, new) FROM stdin;
\.


--
-- Data for Name: post_likes; Type: TABLE DATA; Schema: public; Owner: dillondavis
--

COPY public.post_likes (user_id, post_id, time_added, type) FROM stdin;
\.


--
-- Data for Name: songs; Type: TABLE DATA; Schema: public; Owner: me
--

COPY public.songs (name, link, index, album_id, id, path) FROM stdin;
\.


--
-- Data for Name: sub_comments; Type: TABLE DATA; Schema: public; Owner: dillondavis
--

COPY public.sub_comments (id, username, user_picture, user_id, time_added, text, parent_id, post_id) FROM stdin;
\.


--
-- Data for Name: track; Type: TABLE DATA; Schema: public; Owner: dillondavis
--

COPY public.track (path, id, author) FROM stdin;
\.


--
-- Data for Name: track_images; Type: TABLE DATA; Schema: public; Owner: dillondavis
--

COPY public.track_images (path, id, author) FROM stdin;
\.


--
-- Data for Name: user_followers; Type: TABLE DATA; Schema: public; Owner: dillondavis
--

COPY public.user_followers (user_id, follower_id, time_added) FROM stdin;
\.


--
-- Data for Name: user_images; Type: TABLE DATA; Schema: public; Owner: dillondavis
--

COPY public.user_images (image_name, type, size, path, user_id) FROM stdin;
\.


--
-- Data for Name: user_info; Type: TABLE DATA; Schema: public; Owner: dillondavis
--

COPY public.user_info (username, user_id) FROM stdin;
\.


--
-- Data for Name: video; Type: TABLE DATA; Schema: public; Owner: dillondavis
--

COPY public.video (path, id, author) FROM stdin;
\.


--
-- Data for Name: video_thumbnails; Type: TABLE DATA; Schema: public; Owner: dillondavis
--

COPY public.video_thumbnails (path, id, author) FROM stdin;
\.


--
-- Name: albums albums_pkey; Type: CONSTRAINT; Schema: public; Owner: dillondavis
--

ALTER TABLE ONLY public.albums
    ADD CONSTRAINT albums_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: dillondavis
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: fields fields_pkey; Type: CONSTRAINT; Schema: public; Owner: dillondavis
--

ALTER TABLE ONLY public.fields
    ADD CONSTRAINT fields_pkey PRIMARY KEY (id);


--
-- Name: songs songs_pkey; Type: CONSTRAINT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.songs
    ADD CONSTRAINT songs_pkey PRIMARY KEY (id);


--
-- Name: sub_comments sub_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: dillondavis
--

ALTER TABLE ONLY public.sub_comments
    ADD CONSTRAINT sub_comments_pkey PRIMARY KEY (id);


--
-- Name: file unique_id; Type: CONSTRAINT; Schema: public; Owner: dillondavis
--

ALTER TABLE ONLY public.file
    ADD CONSTRAINT unique_id UNIQUE (album_id);


--
-- Name: songs unique_index_per_album; Type: CONSTRAINT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.songs
    ADD CONSTRAINT unique_index_per_album UNIQUE (album_id, index);


--
-- Name: file file_album_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dillondavis
--

ALTER TABLE ONLY public.file
    ADD CONSTRAINT file_album_id_fkey FOREIGN KEY (album_id) REFERENCES public.albums(id);


--
-- Name: songs songs_album_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: me
--

ALTER TABLE ONLY public.songs
    ADD CONSTRAINT songs_album_id_fkey FOREIGN KEY (album_id) REFERENCES public.albums(id);


--
-- Name: TABLE albums; Type: ACL; Schema: public; Owner: dillondavis
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.albums TO me;


--
-- Name: TABLE comment_likes; Type: ACL; Schema: public; Owner: dillondavis
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.comment_likes TO me;


--
-- Name: TABLE comments; Type: ACL; Schema: public; Owner: dillondavis
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.comments TO me;


--
-- Name: TABLE fields; Type: ACL; Schema: public; Owner: dillondavis
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.fields TO me;


--
-- Name: TABLE file; Type: ACL; Schema: public; Owner: dillondavis
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.file TO me;


--
-- Name: TABLE notifications; Type: ACL; Schema: public; Owner: dillondavis
--

GRANT ALL ON TABLE public.notifications TO me;


--
-- Name: TABLE post_likes; Type: ACL; Schema: public; Owner: dillondavis
--

GRANT ALL ON TABLE public.post_likes TO me;


--
-- Name: TABLE sub_comments; Type: ACL; Schema: public; Owner: dillondavis
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.sub_comments TO me;


--
-- Name: TABLE track; Type: ACL; Schema: public; Owner: dillondavis
--

GRANT SELECT,INSERT,UPDATE ON TABLE public.track TO me;


--
-- Name: TABLE track_images; Type: ACL; Schema: public; Owner: dillondavis
--

GRANT SELECT,INSERT,UPDATE ON TABLE public.track_images TO me;


--
-- Name: TABLE user_followers; Type: ACL; Schema: public; Owner: dillondavis
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.user_followers TO me;


--
-- Name: TABLE user_images; Type: ACL; Schema: public; Owner: dillondavis
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.user_images TO me;


--
-- Name: TABLE user_info; Type: ACL; Schema: public; Owner: dillondavis
--

GRANT ALL ON TABLE public.user_info TO me;


--
-- Name: TABLE video; Type: ACL; Schema: public; Owner: dillondavis
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.video TO me;


--
-- Name: TABLE video_thumbnails; Type: ACL; Schema: public; Owner: dillondavis
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.video_thumbnails TO me;


--
-- PostgreSQL database dump complete
--

