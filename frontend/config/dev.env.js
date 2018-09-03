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
  CODELAB_GITHUB_AUTH_CLIENT_ID:
    '"' + (process.env.CODELAB_GITHUB_AUTH_CLIENT_ID || '740ecf728a1bf799961b') + '"',
  CODELAB_MSU_AUTH_CLIENT_ID:
    '"' + (process.env.CODELAB_MSU_AUTH_CLIENT_ID || 'OAuth-MI-MSU-Lansing-Codes-Dev') + '"',
  CODELAB_SERVER_BASE_URL:
    '"' + (process.env.CODELAB_SERVER_BASE_URL || 'https://localhost:8080') + '"'
}
