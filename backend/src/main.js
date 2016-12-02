// Polyfill features that are not yet natively
// supported in node
import 'babel-polyfill'

import Hapi from 'hapi'
import logRequests from './log-requests'
import firebase from 'firebase-admin'

import * as firebaseSettings from './firebase-settings'
import { verifyJWTOptions, verifyJWT } from './helpers/verify-firebase-jwt'

// ------
// CONFIG
// ------

const server = new Hapi.Server({
  connections: {
    routes: {
      cors: true,
      files: {
        // All static assets in frontend/dist
        relativeTo: require('./constants').frontendDir
      }
    }
  }
})

server.connection({
  host: '0.0.0.0',
  port: process.env.PORT || 4000
})

// -------------------
// DATABASE SETUP
// -------------------

firebase.initializeApp(firebaseSettings.appConfig)

// -------------------
// PLUGIN REGISTRATION
// -------------------

const plugins = [
  require('inert'), // For serving static assets
  require('hapi-auth-jwt2'), // For JWT authentication
  require('hapi-plugin-co') // For generator-style handlers
]

// Enforce HTTPS when in production
if (process.env.NODE_ENV === 'production') {
  plugins.push(require('hapi-require-https'))
}

server.register(plugins, error => {
  if (error) throw error

  // --------------
  // AUTHENTICATION
  // --------------

  // https://github.com/dwyl/hapi-auth-jwt2
  // https://firebase.google.com/docs/auth/server/verify-id-tokens
  // http://catchcoder.com/questions/lpg64/firebase-custom-token-authentication-firebase-version-3

  server.auth.strategy('jwt', 'jwt', {
    key: firebaseSettings.secretOrPublicKey,
    verifyOptions: verifyJWTOptions,
    verifyFunc: verifyJWT
  })

  // ------------------------
  // 3RD-PARTY SERVICE ROUTES
  // ------------------------

  // Let's Encrypt Verification
  server.route({
    method: 'GET',
    path: '/.well-known/acme-challenge/vrUiRMkqkvskketMH03SnD1l_r5UyRv9MTHnmVl3W5I',
    handler (request, reply) {
      reply('vrUiRMkqkvskketMH03SnD1l_r5UyRv9MTHnmVl3W5I.QM9b48okjRNaKQUQwaWWZBaguWP08vF-cZUDzHQdWXs')
    }
  })

  // ----------
  // API ROUTES
  // ----------

  const routeConfigs = {
    '/api': require('./routes/api-routes').config,
    '/auth': require('./routes/auth-routes').config
  }

  Object.entries(routeConfigs).forEach(([baseUrl, configs]) => {
    configs.forEach(config => { config.path = baseUrl + config.path })
    server.route(configs)
  })

  // ----------
  // SPA ROUTES
  // ----------
  // Redirect all unmatched routes to the frontend

  server.route({
    method: 'GET',
    path: '/static/{file*}',
    config: {
      handler: {
        directory: {
          path: './static'
        }
      }
    }
  })

  server.route({
    method: '*',
    path: '/{route*}',
    config: {
      handler: {
        file: 'index.html'
      }
    }
  })

  // -------
  // LOGGING
  // -------

  logRequests()

  // -----
  // START
  // -----

  server.start(error => {
    if (error) throw error
    console.log('Server running at:', server.info.uri)
  })
})
