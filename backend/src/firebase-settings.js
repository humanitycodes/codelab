import NodeRSA from 'node-rsa'
import fs from 'fs'
import path from 'path'

let firebaseAppConfig

function fullPath (relPath) {
  return path.resolve(__dirname, relPath)
}

if (process.env.NODE_ENV === 'production') {
  firebaseAppConfig = {
    serviceAccount: fullPath('../env/production/firebase-service-account.json'),
    databaseURL: 'https://msulansingcodes.firebaseio.com'
  }
} else {
  try {
    // Try to use user-specific dev config
    firebaseAppConfig = {
      serviceAccount: fullPath(`../env/dev/firebase-service-account-${process.env.USER}.json`),
      databaseURL: `https://msulansingcodesdev-${process.env.USER}.firebaseio.com`
    }

    // Test if the user service account file exists
    fs.accessSync(firebaseAppConfig.serviceAccount, fs.F_OK)
  } catch (e) {
    // Use default dev config
    firebaseAppConfig = {
      serviceAccount: fullPath('../env/dev/firebase-service-account.json'),
      databaseURL: 'https://msulansingcodesdev.firebaseio.com'
    }
  }
}

export const appConfig = firebaseAppConfig

// Read file sync because jwt auth needs to be in place before routes load
const firebasePrivateKey = JSON.parse(fs.readFileSync(firebaseAppConfig.serviceAccount, 'utf8')).private_key
export const secretOrPublicKey = new NodeRSA(firebasePrivateKey).exportKey('pkcs8-public-pem')
