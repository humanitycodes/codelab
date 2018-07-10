// Polyfill features that are not yet natively supported in node
import 'babel-polyfill'

// Add ./ (src) to Node search path for imports to avoid lots of ../../../../..
import 'app-module-path/register'

import hapi from 'hapi'
import boom from 'boom'
import { config } from '../env/config'
import jwtSecret from '../env/jwt-secret'
import frontendDir from 'constants/frontend-dir'
import logRequests from 'log-requests'
import sequelize from 'db/sequelize'
import validateJsonWebToken from 'helpers/jwt/validate-json-web-token'
import gatherRoutesForDir from 'routes/_helpers/gather-routes-for-dir'
import refreshTokenOnRequest from 'routes/_helpers/refresh-token-on-request'
import refreshTokenOnResponse from 'routes/_helpers/refresh-token-on-response'

const start = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    process.exit(1)
  }

  const server = hapi.server({
    host: '0.0.0.0',
    port: process.env.PORT || 4000,
    routes: {
      files: {
        // All files will be served from the built frontend directory
        relativeTo: frontendDir
      },
      validate: {
        options: {
          abortEarly: process.env.NODE_ENV === 'production'
        },
        async failAction (request, h, err) {
          console.error('Bad request from client. Reason:', err)
          if (process.env.NODE_ENV === 'production') {
            // Respond with a bad request error that does not leak schema info
            throw boom.badRequest('Invalid request payload input')
          } else {
            // Respond with a complete error, including fields and explanations
            throw err
          }
        }
      }
    }
  })

  // Enforce HTTPS in production
  if (process.env.NODE_ENV === 'production') {
    await server.register(require('hapi-require-https'))
  }

  // Serve static files using inert
  await server.register(require('inert'))

  server.route({
    method: 'GET',
    path: '/static/{file*}',
    handler: {
      directory: {
        path: 'static'
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/{route*}',
    handler: {
      file: 'index.html'
    }
  })

  // Let's Encrypt Verification
  server.route({
    method: 'GET',
    path: '/.well-known/acme-challenge/{challenge*}',
    handler (request, reply) {
      reply(request.params.challenge + '.QM9b48okjRNaKQUQwaWWZBaguWP08vF-cZUDzHQdWXs')
    }
  })

  // Use JWT authentication for all routes by default
  await server.register(require('hapi-auth-jwt2'))

  server.auth.strategy('jwt', 'jwt', {
    key: jwtSecret,
    validate: validateJsonWebToken,
    verifyOptions: {
      ignoreExpiration: true
    }
  })

  server.auth.default('jwt')

  // Refresh the JWT after auth and copy it to the response so the client
  // always sees the token used to authorize their most recent request
  server.ext(refreshTokenOnRequest)
  server.ext(refreshTokenOnResponse)

  // Add all API and third-party authentication routes
  const routeConfigs = {
    '/api': gatherRoutesForDir('api'),
    '/auth': gatherRoutesForDir('auth')
  }

  Object.entries(routeConfigs).forEach(([baseUrl, configs]) => {
    configs.forEach(config => { config.path = baseUrl + config.path })
    server.route(configs)
  })

  // Log all requests
  if (config.logRequests) {
    logRequests()
  }

  // Start serving
  try {
    await server.start()
  } catch (error) {
    console.error('Unable to start server:', error)
    process.exit(1)
  }

  console.log('Server running at:', server.info.uri)
}

start()
