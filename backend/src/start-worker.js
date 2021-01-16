// Babel polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

// Add ./ (src) to Node search path for imports to avoid lots of ../../..
import 'app-module-path/register'

import hapi from '@hapi/hapi'
import boom from '@hapi/boom'
import jwtSecret from '../env/jwt-secret'
import logHttpRequests from '../env/log-http-requests'
import port from '../env/port'
import frontendDir from 'constants/frontend-dir'
import enableHttpRequestLogger from 'enable-http-request-logger'
import sequelize from 'db/sequelize'
import validateJsonWebToken from 'helpers/jwt/validate-json-web-token'
import gatherRoutesForDir from 'routes/_helpers/gather-routes-for-dir'
import refreshTokenOnRequest from 'routes/_helpers/refresh-token-on-request'
import refreshTokenOnResponse from 'routes/_helpers/refresh-token-on-response'
import stopWorker from './stop-worker'

const isProduction = process.env.NODE_ENV === 'production'

// Code to start each worker
export default async () => {
  console.log('Starting worker process')

  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    process.exit(1)
  }

  const server = hapi.server({
    host: '0.0.0.0',
    port,
    state: {
      // Ignore invalid cookie headers and values. See #308
      strictHeader: false,
      ignoreErrors: true
    },
    routes: {
      files: {
        // All files will be served from the built frontend directory
        relativeTo: frontendDir
      },
      validate: {
        options: {
          abortEarly: isProduction
        },
        async failAction (request, h, err) {
          console.error('Bad request from client. Reason:', err)
          if (isProduction) {
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

  // Use Joi to validate HTTP requests
  server.validator(require('joi'))

  // Enforce HTTPS in production
  if (isProduction) {
    await server.register(require('hapi-require-https'))
  }

  // Serve static files using inert
  await server.register(require('@hapi/inert'))

  server.route({
    method: 'GET',
    path: '/static/{file*}',
    config: {
      auth: false
    },
    handler: {
      directory: {
        path: 'static'
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/service-worker.js',
    config: {
      auth: false
    },
    handler: {
      file: 'service-worker.js'
    }
  })

  server.route({
    method: 'GET',
    path: '/{route*}',
    config: {
      auth: false
    },
    handler: {
      file: 'index.html'
    }
  })

  // Let's Encrypt Verification
  server.route({
    method: 'GET',
    path: '/.well-known/acme-challenge/{challenge*}',
    config: {
      auth: false
    },
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

  Object.entries(routeConfigs).forEach(([basePath, configs]) => {
    configs.forEach(config => {
      config.path = basePath + config.path
      console.error(`Route: ${config.method} ${config.path}`)
    })
    server.route(configs)
  })

  // Log all requests
  if (logHttpRequests) {
    enableHttpRequestLogger()
  }

  // Do cleanup for this server
  server.events.on('stop', stopWorker({ exit: false }))

  // Initialize messaging
  require('notifications/messaging')

  // Start serving
  try {
    return server.start().then(() => {
      console.log('Server running at:', server.info.uri)
      return server
    })
  } catch (error) {
    console.error('Unable to start server:', error)
    process.exit(1)
  }
}
