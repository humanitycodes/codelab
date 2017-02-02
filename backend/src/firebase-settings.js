const NodeRSA = require('node-rsa')
const fs = require('fs')
const path = require('path')
const firebase = require('firebase-admin')

let firebaseAppConfig, certPath

function fullCert (relPath) {
  certPath = path.resolve(__dirname, relPath)
  return firebase.credential.cert(require(certPath))
}

if (process.env.NODE_ENV === 'production') {
  firebaseAppConfig = {
    credential: fullCert('../env/production/firebase-service-account.json'),
    databaseURL: 'https://msulansingcodes.firebaseio.com'
  }
} else if (process.env.NODE_ENV === 'staging') {
  firebaseAppConfig = {
    credential: fullCert('../env/staging/firebase-service-account.json'),
    databaseURL: 'https://msulansingcodesstaging.firebaseio.com'
  }
} else {
  try {
    // Try to use user-specific dev config
    firebaseAppConfig = {
      credential: fullCert(`../env/dev/firebase-service-account-${process.env.USER}.json`),
      databaseURL: `https://msulansingcodesdev-${process.env.USER}.firebaseio.com`
    }

    // Test if the user service account file exists
    fs.accessSync(certPath, fs.F_OK)
  } catch (e) {
    // Use default dev config
    firebaseAppConfig = {
      credential: fullCert('../env/dev/firebase-service-account.json'),
      databaseURL: 'https://msulansingcodesdev.firebaseio.com'
    }
  }
}

// Read file sync because jwt auth needs to be in place before routes load
const firebasePrivateKey = require(certPath).private_key

module.exports = {
  appConfig: firebaseAppConfig,
  secretOrPublicKey: new NodeRSA(firebasePrivateKey).exportKey('pkcs8-public-pem')
}
