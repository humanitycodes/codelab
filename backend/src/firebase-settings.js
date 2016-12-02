import NodeRSA from 'node-rsa'
import fs from 'fs'
import path from 'path'
import firebase from 'firebase-admin'

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

export const appConfig = firebaseAppConfig

// Read file sync because jwt auth needs to be in place before routes load
const firebasePrivateKey = require(certPath).private_key
export const secretOrPublicKey = new NodeRSA(firebasePrivateKey).exportKey('pkcs8-public-pem')
