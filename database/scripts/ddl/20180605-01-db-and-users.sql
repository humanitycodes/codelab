-- Create admin role for creating tables, indexes, etc.
CREATE USER codelab_cas_admin;

-- Create app role for accessing data
CREATE USER codelab_cas_app;
REVOKE CREATE ON SCHEMA public FROM codelab_cas_app;

-- Create database
CREATE DATABASE codelab_cas OWNER codelab_cas_admin;

-- Restrict access to database
REVOKE CONNECT ON DATABASE codelab_cas FROM public;
GRANT CONNECT ON DATABASE codelab_cas TO codelab_cas_admin;
GRANT CONNECT ON DATABASE codelab_cas TO codelab_cas_app;
