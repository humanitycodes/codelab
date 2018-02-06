# MSU Codes

## Organization

The codebase is split into two parts: the `frontend` and the `backend`. Each of these directories manages its own dependencies, so if you want to install a new library, first `cd` into the appropriate directory, _then_ `npm install --save some-awesome-lib`.

## Linting

From the `frontend` or `backend` directories, you can run `npm run lint` to scan your files for style violations with ESLint. The conventions in both directories build off the [JS Standard Code Style](https://github.com/feross/eslint-config-standard). It's also recommended to install ESLint integration for your code editor. Here are instructions [Atom](https://github.com/lansingcodelab/www/blob/master/coursework/lessons/slides/js-eslint.md#2-install-the-linter-eslint-plugin-for-atom) and [Sublime Text](https://github.com/roadhump/SublimeLinter-eslint#plugin-installation).

## Testing

No testing framework is yet configured for the backend (Erik, I'll let you do that and update this document). For the frontend, there are [unit tests](http://vuejs-templates.github.io/webpack/unit.html) and [end-to-end tests](http://vuejs-templates.github.io/webpack/e2e.html) configured. They can be run from the `frontend` directory with `npm run unit` and `npm run e2e`, respectively - or `npm run test` to run them all.

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

The development environment can be launched for either the frontend or the backend, by running `npm run dev` from those directories. The frontend launches to port 8080 and the backend to port 4000. On the frontend, `/api` is proxied to the backend. From the root directory, you can also run `npm run dev-all` to launch the entire app.

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

``` sh
brew install certbot # only once
npm run ssl:renew
```
