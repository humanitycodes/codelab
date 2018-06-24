-- Create admin role for creating tables, indexes, etc.
CREATE USER codelab_admin;

-- Create app role for accessing data
CREATE USER codelab_app;
REVOKE CREATE ON SCHEMA public FROM codelab_app;

\password codelab_app;

-- Create database
CREATE DATABASE codelab OWNER codelab_admin;

-- Restrict access to database
REVOKE CONNECT ON DATABASE codelab FROM public;
GRANT CONNECT ON DATABASE codelab TO codelab_admin;
GRANT CONNECT ON DATABASE codelab TO codelab_app;

-- A reminder that DDL can't do everything
DO language plpgsql $$
BEGIN
  RAISE NOTICE 'See README.md for tips about securing your Postgres server.';
END
$$;
