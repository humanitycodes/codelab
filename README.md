# msu.lansing.codes

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

## Continuous Integration and Deployment

Commits to master are automatically deployed to Heroku after tests pass.
