--
-- PostgreSQL database dump
--

\restrict E0L35eyiSzWEH5XJlDYVg2gV8MbUhczaAgWi5YcmVnEmJOkB5DvuxnWcsg6KdCO

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-02-11 01:17:59

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 22240)
-- Name: auth; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO postgres;

--
-- TOC entry 237 (class 1255 OID 22380)
-- Name: get_refresh_token(integer); Type: FUNCTION; Schema: auth; Owner: postgres
--

CREATE FUNCTION auth.get_refresh_token(p_user_id integer) RETURNS TABLE("userId" integer, name text, email text, "tokenHash" text, "userAgent" text, ip text)
    LANGUAGE plpgsql
    AS $$
BEGIN

RETURN QUERY
SELECT T2.ID AS "userId", T2.name, T2.email,T1.token_hash as "tokenHash", T1.USER_AGENT AS "userAgent", T1.IP
FROM auth.refresh_tokens T1
JOIN auth.users T2 ON T1.user_id = T2.id
WHERE T1.user_id = p_user_id
AND T1.revoked_at IS NULL
AND T1.expires_at > NOW();

END;
$$;


ALTER FUNCTION auth.get_refresh_token(p_user_id integer) OWNER TO postgres;

--
-- TOC entry 236 (class 1255 OID 22349)
-- Name: insert_refresh_token(integer, text, timestamp without time zone, text, text); Type: FUNCTION; Schema: auth; Owner: postgres
--

CREATE FUNCTION auth.insert_refresh_token(p_user_id integer, p_token_hash text, p_expires_at timestamp without time zone, p_ip text, p_agent_user text) RETURNS TABLE(status boolean, message text)
    LANGUAGE plpgsql
    AS $$
BEGIN

INSERT INTO auth.refresh_tokens
(id, user_id, token_hash, expires_at, revoked_at, created_at, ip, user_agent)
VALUES(gen_random_uuid(), p_user_id, p_token_hash, p_expires_at, NULL , now(), p_ip, p_agent_user);


    RETURN QUERY
    SELECT true, 'Refresh token inserted';

END;
$$;


ALTER FUNCTION auth.insert_refresh_token(p_user_id integer, p_token_hash text, p_expires_at timestamp without time zone, p_ip text, p_agent_user text) OWNER TO postgres;

--
-- TOC entry 224 (class 1255 OID 22319)
-- Name: login(text); Type: FUNCTION; Schema: auth; Owner: postgres
--

CREATE FUNCTION auth.login(p_email text) RETURNS TABLE(id integer, name text, email text, password text)
    LANGUAGE plpgsql
    AS $$
BEGIN

RETURN QUERY
SELECT T1.id AS id,
 T1."name" AS name,
 T1.email AS email,
 T1."password" AS password
FROM auth.users T1
WHERE LOWER(T1.email) = LOWER(p_email);

END;
$$;


ALTER FUNCTION auth.login(p_email text) OWNER TO postgres;

--
-- TOC entry 223 (class 1255 OID 22318)
-- Name: register_new_user(text, text, text); Type: FUNCTION; Schema: auth; Owner: postgres
--

CREATE FUNCTION auth.register_new_user(p_name text, p_email text, p_password_hash text) RETURNS TABLE(status boolean, message text)
    LANGUAGE plpgsql
    AS $$
BEGIN

    IF EXISTS (SELECT 1 FROM auth.users WHERE email = LOWER(p_email)) THEN
        RETURN QUERY
        SELECT false, 'Email already exists';
        RETURN;
    END IF;

    INSERT INTO auth.users ("name", email, "password")
    VALUES (p_name, LOWER(p_email), p_password_hash);

    RETURN QUERY
    SELECT true, 'User registered';

EXCEPTION
    WHEN unique_violation THEN
        RETURN QUERY
        SELECT false, 'Email already exists';

END;
$$;


ALTER FUNCTION auth.register_new_user(p_name text, p_email text, p_password_hash text) OWNER TO postgres;

--
-- TOC entry 222 (class 1255 OID 22381)
-- Name: revoke_refresh_token(integer, text, text); Type: FUNCTION; Schema: auth; Owner: postgres
--

CREATE FUNCTION auth.revoke_refresh_token(p_user_id integer, p_ip text, p_agent_user text) RETURNS TABLE(status boolean, message text)
    LANGUAGE plpgsql
    AS $$
BEGIN


    UPDATE auth.refresh_tokens
    SET revoked_at = NOW()
    WHERE user_id = p_user_id
      AND revoked_at IS NULL
      AND expires_at > NOW();

END;
$$;


ALTER FUNCTION auth.revoke_refresh_token(p_user_id integer, p_ip text, p_agent_user text) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 221 (class 1259 OID 22297)
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.refresh_tokens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id integer NOT NULL,
    token_hash text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    revoked_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    ip text,
    user_agent text
);


ALTER TABLE auth.refresh_tokens OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 22257)
-- Name: users; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL
);


ALTER TABLE auth.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 22256)
-- Name: users_id_seq; Type: SEQUENCE; Schema: auth; Owner: postgres
--

ALTER TABLE auth.users ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME auth.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 4923 (class 0 OID 22297)
-- Dependencies: 221
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: postgres
--

COPY auth.refresh_tokens (id, user_id, token_hash, expires_at, revoked_at, created_at, ip, user_agent) FROM stdin;
\.


--
-- TOC entry 4922 (class 0 OID 22257)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: postgres
--

COPY auth.users (id, name, email, password) FROM stdin;
\.


--
-- TOC entry 4929 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: postgres
--

SELECT pg_catalog.setval('auth.users_id_seq', 19, true);


--
-- TOC entry 4770 (class 2606 OID 22310)
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4768 (class 2606 OID 22267)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4771 (class 1259 OID 22317)
-- Name: refresh_tokens_token_hash_idx; Type: INDEX; Schema: auth; Owner: postgres
--

CREATE INDEX refresh_tokens_token_hash_idx ON auth.refresh_tokens USING btree (token_hash);


--
-- TOC entry 4772 (class 1259 OID 22316)
-- Name: refresh_tokens_user_id_idx; Type: INDEX; Schema: auth; Owner: postgres
--

CREATE INDEX refresh_tokens_user_id_idx ON auth.refresh_tokens USING btree (user_id);


--
-- TOC entry 4766 (class 1259 OID 22268)
-- Name: users_email_lower_unique; Type: INDEX; Schema: auth; Owner: postgres
--

CREATE UNIQUE INDEX users_email_lower_unique ON auth.users USING btree (lower(email));


--
-- TOC entry 4773 (class 2606 OID 22311)
-- Name: refresh_tokens refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


-- Completed on 2026-02-11 01:17:59

--
-- PostgreSQL database dump complete
--

\unrestrict E0L35eyiSzWEH5XJlDYVg2gV8MbUhczaAgWi5YcmVnEmJOkB5DvuxnWcsg6KdCO

