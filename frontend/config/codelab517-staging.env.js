var merge = require('webpack-merge')
var prodEnv = require('./codelab517-prod.env')

module.exports = merge(prodEnv, {
  // ...
})
