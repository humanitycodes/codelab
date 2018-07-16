## Environment Configuration

The following environment variables can be defined to configure different
instances of the Code Lab application.

### `CODELAB_DB_HOST`

The hostname or IP address of the application's database server.
e.g. `localhost`

### `CODELAB_DB_PASSWORD`

The password used to authenticate against the application's database server.

### `CODELAB_DB_PORT`

The port on which the application's database server allows incoming connections.
e.g. `5432`

### `CODELAB_DB_USERNAME`

The usernamed used to authenticate against the application's database server.
e.g. `codelab_app`

### `CODELAB_JWT_SECRET`

A secret key at least 32 characters long used for signing JSON Web Tokens
for client authentication.

### `CODELAB_LOG_REQUESTS`

Set to `true` to log every incoming and outgoing HTTP request. This will log
every part of the HTTP request (query parameters, headers, body, etc.) so it
should not be enabled in any environment where sensitive information may be
recorded.
