let config

try {
  config = require(`./${process.env.NODE_ENV}/config.js`)
} catch (e) {
  // Use default dev config
  config = require('./dev/config.js')
}

module.exports = {
  config: config
}
