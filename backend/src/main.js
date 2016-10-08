import Hapi from 'hapi'

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
// PLUGIN REGISTRATION
// -------------------

const plugins = [
  require('inert'), // For serving static assets
  require('hapi-auth-jwt2') // For JWT authentication
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

  // ----------
  // API ROUTES
  // ----------

  require('./routes').default(server)

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

  // -----
  // START
  // -----

  server.start(error => {
    if (error) throw error
    console.log('Server running at:', server.info.uri)
  })
})
