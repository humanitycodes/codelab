const { merge } = require('webpack-merge')
const prodEnv = require('./production.env')

module.exports = merge(prodEnv, {
  // ...
})
