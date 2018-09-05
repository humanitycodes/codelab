// -----------------------------------------------------------------------------
// IMPORTANT:
//   1. Changes made here may also need to be reflected in dev.env.js
//   2. Expose environment variables used in src/env/*.js
//   3. Do not expose environment variables that contain private info!
// -----------------------------------------------------------------------------

module.exports = {
  NODE_ENV: '"production"',
  CODELAB_BRAND: '"' + process.env.CODELAB_BRAND + '"',
  CODELAB_FIREBASE_CLIENT_CONFIG_JSON:
    '\'' + process.env.CODELAB_FIREBASE_CLIENT_CONFIG_JSON + '\'',
  CODELAB_FIREBASE_VAPID_PUBLIC_KEY:
    '"' + process.env.CODELAB_FIREBASE_VAPID_PUBLIC_KEY + '"',
  CODELAB_GITHUB_AUTH_CLIENT_ID:
    '"' + process.env.CODELAB_GITHUB_AUTH_CLIENT_ID + '"',
  CODELAB_MSU_AUTH_CLIENT_ID:
    '"' + process.env.CODELAB_MSU_AUTH_CLIENT_ID + '"',
  CODELAB_SERVER_BASE_URL:
    '"' + process.env.CODELAB_SERVER_BASE_URL + '"'
}
