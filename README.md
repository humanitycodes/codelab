# MSU Codes

## Organization

The codebase is split into several parts:

* `.circleci` - Continuous integration configuration via [CircleCI](https://circleci.com/gh/chrisvfritz/msu.lansing.codes)
* `.vscode` - VS Code is the editor of choice for this project and workspace configuration is provided in this directory
* `backend` - Code for the server-side API, which also hosts the client code in non-dev environments
* `database` - Anything related specifically to the Postgres database (docs, migration scripts, etc.)
* `frontend` - All Vue components, styles, and client-side content are here, built with Webpack
* `test` - End-to-end and any other cross-module tests will be found here


Each of these directories manages its own dependencies. If you want to install a new library, first `cd` into the appropriate directory, _then_ use `yarn add` to add the dependency.

## Linting

From the `frontend`, `backend`, and `test` directories, you can run `yarn lint` to scan your files for style violations with ESLint. The conventions in both directories build off the [JS Standard Code Style](https://github.com/feross/eslint-config-standard). VS Code configuration for ESLint is also provided in the `.vscode` directory.

## Testing

Unit tests are maintained for frontend components and helper functions. All statement, branch, and function coverage should be kept above 80%.

End-to-end tests exist in the `test` directory and cover primarily core functionality and security checks.

All tests run as part of continuous integration and merging features is not allowed until all tests pass. To run tests for a specific module, first `cd` into that directory and then run `yarn test`. To run all tests, which is recommended before submitting a PR, run `yarn test-all` from the top-most project directory.

## Contributing

To ensure frequent communication, all features will be done in feature branches (we are not able to push to `master`). Here's a good process for starting a new feature:

``` sh
git fetch origin
git checkout master
git reset --hard origin/master
git checkout -b my-feature-branch
```

Before merging, each feature must be reviewed by at least one other team member and be up-to-date with master. That means it's a good idea to rebase frequently:

``` sh
git fetch origin
git checkout my-feature-branch # if you're not already there
git rebase origin/master
```

When you're finally done, rebase one more time if necessary, then:

``` sh
git push origin my-feature-branch
```

And open a pull request.

## Development

The development environment can be launched for either the frontend or the backend, by running `yarn dev` from the respective directory. The frontend launches to port 8080 and the backend to port 4000. On the frontend, the `/api` and `/auth` routes are proxied to the backend. From the top-most directory, you can also run `yarn dev-all` to launch the entire app, complete with hot-reloading.

Once the app is running, you can go to `https://localhost:8080/github-sign-in` to sign in with your GitHub account. To sign in with your MSU Net ID, visit `https://localhost:8080/msu-sign-in`.

It may be helpful to enable extra logging when testing in a development environment, in particular, HTTP request logging and SQL statement logging. This can be done by setting the environment variables `CODELAB_LOG_HTTP_REQUESTS` and `CODELAB_LOG_SQL_STATEMENTS` to `true`, respectively. For more information about environment variables, see `backend/env/README.md`.

### Initial Setup

After cloning the repository, run `yarn install` at the top-most directory to download and install all project dependencies for all modules.

You will also need to install [Postgres 10.4 or higher](https://www.postgresql.org/download/). Once your Postgres server is running, follow all of the instructions in `database/README.md` to create the `codelab` database, users, and tables.

## Continuous Integration and Deployment

When builds pass on CircleCI, GitHub's:

- `master` branch deploys to the [staging server](https://msu-codes-staging.herokuapp.com)
- `production` branch deploys to the [production server](https://codelab.cas.msu.edu/)

There are also several commands you can use:

### `yarn deploy:staging-to-production`

When code on staging passes QA, this promotes the `master` branch on GitHub to `production` and pushes to the production server on a successful build.

### `yarn deploy-force:local-to-staging`

Bypasses GitHub to deploy your current branch directly to staging, skipping any linting or tests. This should ONLY be used when all of these are true:

1. What's currently on staging has already been approved for production
2. You want to do some QA before completing the code review

### `yarn deploy-force:local-to-production`

To be used ONLY for hotfixes in emergency situations. For example:

- The app isn't working on production and it's blocking students from doing any work
- Students are seeing incorrect information, which is causing a great deal of confusion

Since this bypasses linting, tests, and QA, it is up to you to confirm that your changes do not cause more harm than good.

## SSL Certificate Renewal

The SSL certificate for codelab.cas.msu.edu is automatically managed and renewed
by Heroku. More information can be found in the _Domains and Certificates_
section of the `msu-lansing-codes` settings page at heroku.com.
