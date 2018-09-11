\set ON_ERROR_STOP on

-- user_messaging_token
CREATE TABLE user_messaging_token (
  user_messaging_token_id BIGINT NOT NULL DEFAULT NEXTVAL('id_sequence'),
  user_id BIGINT NOT NULL,
  messaging_token TEXT NOT NULL,
  version INTEGER,
  PRIMARY KEY (user_messaging_token_id)
);

GRANT ALL ON user_messaging_token TO CURRENT_USER;

CREATE INDEX user_messaging_token_user_id_index
ON user_messaging_token (user_id);
