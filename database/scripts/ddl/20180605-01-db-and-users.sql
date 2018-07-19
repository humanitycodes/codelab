\set ON_ERROR_STOP on

-- Create admin role for creating tables, indexes, etc.
CREATE USER codelab_admin;

-- Create app role for accessing data
\set CODELAB_DB_PASSWORD `echo ${CODELAB_DB_PASSWORD}`
CREATE USER codelab_app WITH PASSWORD :'CODELAB_DB_PASSWORD';
REVOKE CREATE ON SCHEMA public FROM codelab_app;

-- Create database
CREATE DATABASE codelab OWNER codelab_admin;

-- Restrict access to database
REVOKE CONNECT ON DATABASE codelab FROM public;
GRANT CONNECT ON DATABASE codelab TO codelab_admin;
GRANT CONNECT ON DATABASE codelab TO codelab_app;

-- A reminder that DDL can't do everything
DO language plpgsql $$
BEGIN
  RAISE NOTICE 'See README.md for tips about configuring your Postgres server.';
END
$$;
