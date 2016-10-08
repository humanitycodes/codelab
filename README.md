# msu.lansing.codes

## Organization

The codebase is split into two parts: the `frontend` and the `backend`. Each of these directories manages its own dependencies, so if you want to install a new library, first `cd` into the appropriate directory, _then_ `npm install --save some-awesome-lib`.

## Linting

From the `frontend` or `backend` directories, you can run `npm run lint` to scan your files for style violations with ESLint. The conventions in both directories build off the [JS Standard Code Style](https://github.com/feross/eslint-config-standard). It's also recommended to install ESLint integration for your code editor. Here are instructions [Atom](https://github.com/lansingcodelab/www/blob/master/coursework/lessons/slides/js-eslint.md#2-install-the-linter-eslint-plugin-for-atom) and [Sublime Text](https://github.com/roadhump/SublimeLinter-eslint#plugin-installation).

## Testing

No testing framework is yet configured for the backend (Erik, I'll let you do that and update this document). For the frontend, there are [unit tests](http://vuejs-templates.github.io/webpack/unit.html) and [end-to-end tests](http://vuejs-templates.github.io/webpack/e2e.html) configured. They can be run from the `frontend` directory with `npm run unit` and `npm run e2e`, respectively - or `npm run test` to run them all.

## Contributing

Since we'll be working on mostly separate parts of the application and with a small team, I think it's fine to just push to master, though only non-destructive pushes are allowed (i.e. no force pushing). That means as you're developing a feature, it'll be good to rebase frequently with:

``` sh
git fetch origin
git checkout master # or your feature branch
git rebase origin/master
```

When you're finally done, rebase one more time if necessary, then:

``` sh
git push origin master
```

If there's a feature you want review on, push it to a feature branch on GitHub and submit a pull request. We'll have to discuss which kinds of changes, if any, should require review.
