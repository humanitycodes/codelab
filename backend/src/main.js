import Hapi from 'hapi'
import logRequests from './log-requests'
import _ from 'lodash'

// ------
// CONFIG
// ------

// Do not use dotenv in production because Heroku
// blows up if you do.
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

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
  // https://firebase.google.com/docs/auth/web/custom-auth
  server.auth.strategy('jwt', 'jwt', {
    key: new Buffer('SECRET_KEY', 'base64'),
    verifyOptions: {
      algorithms: ['HS256'],
      // Will be required if we use something like Auth0
      audience: 'JTW_PROVIDER_USER_ID'
    },
    validateFunc (decoded, request, callback) {
      callback(null, !!decoded)
    }
  })

  // ------------------------
  // 3RD-PARTY SERVICE ROUTES
  // ------------------------

  // Let's Encrypt Verification
  server.route({
    method: 'GET',
    path: '/.well-known/acme-challenge/2YzSws1BiRjdHLLavdtTdX3pC_c55EZtYiyDXNnO2FI',
    handler (request, reply) {
      reply('2YzSws1BiRjdHLLavdtTdX3pC_c55EZtYiyDXNnO2FI.QM9b48okjRNaKQUQwaWWZBaguWP08vF-cZUDzHQdWXs')
    }
  })

  // ----------
  // API ROUTES
  // ----------

  const routeConfigs = {
    '/api': require('./routes/api-routes').config,
    '/auth': require('./routes/auth-routes').config
  }

  _.forEach(routeConfigs, (configs, baseUrl) => {
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
