// -----------------------------------------------------------------------------
// IMPORTANT:
//   1. Changes made here may also need to be reflected in production.env.js
//   2. Expose environment variables used in src/env/*.js
//   3. Do not expose environment variables that contain private info!
// -----------------------------------------------------------------------------

module.exports = {
  NODE_ENV: '"development"',
  CODELAB_BRAND:
    '"' + (process.env.CODELAB_BRAND || 'msu') + '"',
  CODELAB_FIREBASE_CLIENT_CONFIG_JSON:
    '\'' + (
      process.env.CODELAB_FIREBASE_CLIENT_CONFIG_JSON ||
      JSON.stringify({
        apiKey: 'AIzaSyCOW-u6G6qJ8wj8ubo_r3a6UR77AhutEho',
        authDomain: 'codelab-dev.firebaseapp.com',
        databaseURL: 'https://codelab-dev.firebaseio.com',
        projectId: 'codelab-dev',
        storageBucket: 'codelab-dev.appspot.com',
        messagingSenderId: '137126158565'
      })
    ) + '\'',
  CODELAB_FIREBASE_VAPID_PUBLIC_KEY:
    '"' + (
      process.env.CODELAB_FIREBASE_VAPID_PUBLIC_KEY ||
      'BLDiUBUo4EZ7kv3JOpojOwR-I89viTZZd6iFp9aaIr4WumkVkXAqEfUs5AlGLfO_GuDFKIiarYQGAhZ7f2CxjUc'
    ) + '"',
  CODELAB_GITHUB_AUTH_CLIENT_ID:
    '"' + (process.env.CODELAB_GITHUB_AUTH_CLIENT_ID || '740ecf728a1bf799961b') + '"',
  CODELAB_MSU_AUTH_CLIENT_ID:
    '"' + (process.env.CODELAB_MSU_AUTH_CLIENT_ID || 'OAuth-MI-MSU-Lansing-Codes-Dev') + '"',
  CODELAB_SERVER_BASE_URL:
    '"' + (process.env.CODELAB_SERVER_BASE_URL || 'https://localhost:8080') + '"'
}
