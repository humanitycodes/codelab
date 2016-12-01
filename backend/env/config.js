import fs from 'fs'

let configFile

try {
  configFile = `./${process.env.NODE_ENV}/config.js`

  // Test if the file exists
  fs.accessSync(configFile, fs.F_OK)
} catch (e) {
  // Use default dev config
  configFile = './dev/config.js'
}

export const config = require(configFile).config
