var merge = require('webpack-merge')
var prodEnv = require('./msu-prod.env')

module.exports = merge(prodEnv, {
  // ...
})
