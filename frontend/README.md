# frontend

The pretty, interactive side of Code Lab.

## Build Setup

``` bash
# install dependencies
yarn install

# serve content at localhost:8080 (may not work without the backend running)
yarn dev

# build for higher environments with minification
yarn build

# run unit tests
yarn unit

# run unit tests and re-run if any of them change
yarn unit:watch

# run all tests
yarn test
```

For detailed explanation on how things work, checkout the
[guide](http://vuejs-templates.github.io/webpack/) and
[docs for vue-loader](http://vuejs.github.io/vue-loader).

## Testing

### Notifications

In order to test real-time notifications (turning them on and receiving them),
the web browser must be configured to trust the certificate for
`https://localhost`.

[Follow these instructions](https://stackoverflow.com/a/46116098/1696044)
for the browser of choice before testing.
