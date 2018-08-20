# Code Lab

## Organization

The codebase is split into several parts:

* `.circleci` - Continuous integration configuration via [CircleCI](https://circleci.com/gh/humanitycodes/codelab)
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

This software is configured to deploy to numerous environments via CircleCI:

* `testing` is a temporary environment used for running tests after every push to GitHub
* `msu-staging` is the short name for the [MSU Code Lab staging environment](https://msu-codes-staging.herokuapp.com) that is automatically deployed every time changes are promoted to the `master` branch
* `codelab517-staging` is the short name for the [Code Lab 517 staging environment](https://codelab517-staging.herokuapp.com) that is automatically deployed every time changes are promoted to the `master` branch
* `msu-prod` is the short name for the [MSU Code Lab production environment](https://codelab.cas.msu.edu) that is automatically deployed every time changes are promoted to the `msu-prod` branch
* `codelab517-prod` is the short name for the [Code Lab 517 production environment](https://www.codelab517.com) that is automatically deployed every time changes are promoted to the `codelab517-prod` branch

When a code change is promoted to the `master` branch, all staging environments (environments that end with `-staging`) will be deployed simultaneously. These environments all run in Heroku using free hobby plans.

To add the git remote endpoints to your local environment, make sure you have access to the apps in Heroku, download the Heroku CLI tool and login, then run the following commands:

``` sh
heroku git:remote -a msu-codes-staging -r msu-staging
heroku git:remote -a codelab517-staging -r codelab517-staging
```

There are also several commands you can use to initiate deployments:

### `yarn deploy:msu-staging-to-production`

When code on staging passes QA, this promotes the `master` branch on GitHub to `msu-prod` and pushes to the production server on a successful build.

### `yarn deploy-force:msu-local-to-staging`

Bypasses GitHub to deploy your current branch directly to `msu-staging`, skipping any linting or tests. This should ONLY be used when all of these are true:

1. What's currently on staging has already been approved for production
2. You want to do some QA before completing the code review

### `yarn deploy-force:msu-local-to-production`

Deploys your current branch directly to `msu-prod`. To be used ONLY for hotfixes in emergency situations. For example:

- The app isn't working on production and it's blocking students from doing any work
- Students are seeing incorrect information, which is causing a great deal of confusion

Since this bypasses linting, tests, and QA, it is up to you to confirm that your changes do not cause more harm than good.

### `yarn deploy:codelab517-staging-to-production`

When code on staging passes QA, this promotes the `master` branch on GitHub to `codelab517-prod` and pushes to the production server on a successful build.

### `yarn deploy-force:codelab517-local-to-staging`

Bypasses GitHub to deploy your current branch directly to `codelab517-staging`, skipping any linting or tests. This should ONLY be used when all of these are true:

1. What's currently on staging has already been approved for production
2. You want to do some QA before completing the code review

### `yarn deploy-force:codelab517-local-to-production`

Deploys your current branch directly to `codelab517-prod`. To be used ONLY for hotfixes in emergency situations. For example:

- The app isn't working on production and it's blocking students from doing any work
- Students are seeing incorrect information, which is causing a great deal of confusion

Since this bypasses linting, tests, and QA, it is up to you to confirm that your changes do not cause more harm than good.

## SSL Certificate Renewal

The SSL certificates for [codelab.cas.msu.edu](https://codelab.cas.msu.edu) and [codelab517.com](https://www.codelab517.com) are automatically managed and renewed by Heroku. More information can be found in the _Domains and Certificates_
section of the respective environment's settings on [heroku.com](https://dashboard.heroku.com/apps).
