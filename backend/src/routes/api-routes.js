import joi from 'joi'

export const config = [
  {
    method: 'GET',
    path: `/authenticated`,
    config: {
      auth: {
        // https://github.com/dwyl/hapi-auth-jwt2#authentication-modes
        mode: 'try',
        strategy: 'jwt'
      }
    },
    handler: (request, reply) => {
      reply({ authenticated: request.auth.isAuthenticated })
    }
  },
  {
    method: 'POST',
    path: `/project-submissions`,
    config: {
      auth: {
        mode: 'required',
        strategy: 'jwt'
      },
      validate: {
        payload: joi.object({
          courseKey: joi.string().required(),
          lessonKey: joi.string().required(),
          projectKey: joi.string().required()
        }).required()
      }
    },
    handler: (request, reply) => {
      reply(request.payload)
    }
  }
]
