var merge = require('webpack-merge')
var prodEnv = require('./production.env')

module.exports = merge(prodEnv, {
  // ...
})
