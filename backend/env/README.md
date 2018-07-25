## Environment Configuration

The following environment variables can be defined to configure different
instances of the Code Lab application.

### `CODELAB_DB_HOST`

The hostname or IP address of the application's database server. The default
database host is `localhost`.

See alo `DATABASE_URL`.

### `CODELAB_DB_NAME`

The name of the database that the application will attempt to use after
successfully connecting. The default database name is `codelab`.

See alo `DATABASE_URL`.

### `CODELAB_DB_PASSWORD`

The password used to authenticate against the application's database server.
The default database password is `Jenny*^&%#)(`.

See alo `DATABASE_URL`.

### `CODELAB_DB_PORT`

The port on which the application's database server allows incoming connections.
The default database port is `5432`.

See alo `DATABASE_URL`.

### `CODELAB_DB_USERNAME`

The username used to authenticate against the application's database server.
The default database username is `codelab_app`.

See alo `DATABASE_URL`.

### `CODELAB_GITHUB_AUTH_CLIENT_SECRET`

A secret key provided by GitHub self-service that is required to successfully
authenticate an account using GitHub's OAuth service.

### `CODELAB_GITHUB_EVENTS_PATH_SECRET`

The secret path to where GitHub should post webhooks when users interact with
their repositories for a given environment. This value is provided to GitHub
any time a repository is created inside the application. In other words, no
external configuration on GitHub.com is needed if this value changes.
e.g. `871255a9-83c9-496b-90b8-24440f16dc77`

### `CODELAB_JWT_SECRET`

A secret key at least 32 characters long used for signing JSON Web Tokens
for client authentication.

### `CODELAB_LOG_HTTP_REQUESTS`

Set to `true` to log every incoming and outgoing HTTP request. This will log
every part of the HTTP request (query parameters, headers, body, etc.) so it
should not be enabled in any environment where sensitive information may be
recorded.

### `CODELAB_LOG_SQL_STATEMENTS`

Set to `true` to log every SQL statement executed against the database. Only
the statements, including query parameters, will be logged. Query results will
never be logged.

### `CODELAB_MSU_AUTH_CLIENT_SECRET`

A secret key provided by MSU IT Services that is required to successfully
authenticate an account using MSU's OAuth service.

### `DATABASE_URL`

In hosted environments such as Heroku, the `DATABASE_URL` environment variable
may automatically be provided with all of the information needed to connect to
the database. If `DATABASE_URL` is set, the application will ignore all other
`CODELAB_DB_*` environment variables and instead use `DATABASE_URL` as the sole
means for connecting to the database in that environment.

### `PORT`

Used in non-development environments to indicate which port the backend server
will run on. In these environments, the `PORT` environment variable is usually
set automatically and the value is used internally and mapped to ports 80/443
for public access. The default value is `4000`.

### `WEB_CONCURRENCY`

Used to indicate the number of CPU cores available for the server to spawn
additional worker processes. This environment variable is automatically set
in some hosted environments such as Heroku. The default value is `1`.
