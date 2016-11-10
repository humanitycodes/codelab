import NodeRSA from 'node-rsa'
import fs from 'fs'

let firebaseAppConfig = {
  serviceAccount: './env/dev/firebase-service-account.json',
  databaseURL: 'https://msulansingcodesdev.firebaseio.com'
}
if (process.env.NODE_ENV === 'production') {
  firebaseAppConfig = {
    serviceAccount: './env/production/firebase-service-account.json',
    databaseURL: 'https://msulansingcodes.firebaseio.com'
  }
}

export const appConfig = firebaseAppConfig

// Read file sync because jwt auth needs to be in place before routes load
const firebasePrivateKey = JSON.parse(fs.readFileSync(firebaseAppConfig.serviceAccount, 'utf8')).private_key
export const secretOrPublicKey = new NodeRSA(firebasePrivateKey).exportKey('pkcs8-public-pem')
