## Environment Configuration

The following environment variables can be defined to configure different
instances of the Code Lab application.

~~~
When making a change to any of these environment variables in a testing,
staging, or production environment, make sure to update the value in that
environment's KeePass database as well!
~~~

### `CODELAB_BRAND`

The name of the brand used in this environment. Choices are: `codelab517` or
`msu`. The brand influences both the behavior of the application and how it
looks to users.

### `CODELAB_DB_HOST`

The hostname or IP address of the application's database server. The default
database host is `localhost`.

See also `DATABASE_URL`.

### `CODELAB_DB_NAME`

The name of the database that the application will attempt to use after
successfully connecting. The default database name is `codelab`.

See also `DATABASE_URL`.

### `CODELAB_DB_PASSWORD`

The password used to authenticate against the application's database server.
The default database password is `Jenny*^&%#)(`.

See also `DATABASE_URL`.

### `CODELAB_DB_PORT`

The port on which the application's database server allows incoming connections.
The default database port is `5432`.

See also `DATABASE_URL`.

### `CODELAB_DB_USERNAME`

The username used to authenticate against the application's database server.
The default database username is `codelab_app`.

See also `DATABASE_URL`.

### `CODELAB_FIREBASE_ADMIN_PRIVATE_KEY_JSON`

A stringified version of the Firebase service account's private key. The value
is usd by the backend to connect to Firebase and send messages to frontend
users. The private key can be generated in a Firebase project by navigating to
the Project Settings, clicking on the Service Accounts tab, and then pressing
the "Generate new private key" button at the bottom of the page.

To set this environment variable, assign the private key JSON to a variable name
in Chrome Devtools or Node, then call `JSON.stringify` on the variable:

``` javascript
var key = {
  "type": "service_account",
  "project_id": "codelab-dev",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-sgfaw@codelab-dev.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}

JSON.stringify(key)
```

The default value is the JSON string for the `codelab-dev` project in Firebase.

### `CODELAB_FIREBASE_CLIENT_CONFIG_JSON`

A stringified version of the Firebase client configuration for a particular
project. The configuration for a Firebase project can be found by visiting the
[Firebase console](https://console.firebase.google.com), clicking on the
project, then clicking on "Add Firebase to your web app" at the bottom of the
Project Settings page. It will look like this:

``` javascript
var config = {
  apiKey: "AIzaSyCOW-u6G6qJ8wj8ubo_r3a6UR77AhutEho",
  authDomain: "codelab-dev.firebaseapp.com",
  databaseURL: "https://codelab-dev.firebaseio.com",
  projectId: "codelab-dev",
  storageBucket: "codelab-dev.appspot.com",
  messagingSenderId: "137126158565"
};
```

To set this environment variable, run the JavaScript provided by Firebase to
define the `config` variable (in Chrome devtools, Node, etc.). Then run
`JSON.stringify(config)` to get the string value of the configuration. Place
the resulting string inside the `CODELAB_FIREBASE_CLIENT_CONFIG_JSON`
environment variable.

The default value is the JSON string for the `codelab-dev` project in Firebase.

### `CODELAB_FIREBASE_PROJECT_ID`

The unique identifier for the Firebase project to be used for this environment.
The value can be found on the General tab of the Project Settings page in the
Firebase console. The default value is `codelab-dev`.

### `CODELAB_FIREBASE_VAPID_PUBLIC_KEY`

The public VAPID key used by the frontend to authorize push notifications from
Firebase. This value can be retrieved from the "Web Push certificates" section
of the Cloud Messaging tab of a Firebase project's Settings page. The default
value is the public VAPID key for the `codelab-dev` project in Firebase.

### `CODELAB_GITHUB_AUTH_CLIENT_ID`

A unique identifier provided by GitHub self-service that is required to
successfully authenticate an account using GitHub's OAuth service. The default
value is `740ecf728a1bf799961b`.

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

### `CODELAB_MSU_AUTH_CLIENT_ID`

A unique identifier provided by MSU IT Services that is required to
successfully authenticate an account using MSU's OAuth service. The default
value is `OAuth-MI-MSU-Lansing-Codes-Dev`.

### `CODELAB_MSU_AUTH_CLIENT_SECRET`

A secret key provided by MSU IT Services that is required to successfully
authenticate an account using MSU's OAuth service.

### `CODELAB_SERVER_BASE_URL`

The URL where this instance of Code Lab can be accessed from a web browser.
e.g. `https://localhost:8080` or `https://www.codelab517.com`. The default value
is `https://localhost:8080`.

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
