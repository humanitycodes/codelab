\set ON_ERROR_STOP on

-- add messaging_token to app_user
ALTER TABLE app_user ADD COLUMN messaging_token TEXT;
