import '@notifications/_helpers/handle-background-messages'

// More info about service worker update lifecycle:
// https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#updates

// Claim all tabs right away (instead of after next page reload)
self.addEventListener('activate', event => {
  self.clients.claim()
})

// When a new service worker has been installed, activate it immediately
self.addEventListener('install', event => {
  self.skipWaiting()
})
