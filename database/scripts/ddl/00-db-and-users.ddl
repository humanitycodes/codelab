--------------------------------------------------------------------------------
-- IMPORTANT NOTE
-- --------------
--   This script will fail in hosted environments like Heroku!
--   Only run this script in completely self-managed databases
--   such as locally or on CircleCI.
--------------------------------------------------------------------------------

\set ON_ERROR_STOP on

-- Create app role for accessing data
\set CODELAB_DB_PASSWORD `echo ${CODELAB_DB_PASSWORD}`
CREATE USER codelab_app WITH PASSWORD :'CODELAB_DB_PASSWORD';

-- Create database
CREATE DATABASE codelab OWNER codelab_app;
GRANT ALL ON DATABASE codelab TO codelab_app;

-- A reminder that DDL can't do everything
DO language plpgsql $$
BEGIN
  RAISE NOTICE 'See README.md for tips about configuring your Postgres server.';
END
$$;
