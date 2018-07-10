import joi from 'joi'
import boom from 'boom'

import { config as env } from '../../../env/config'
import githubEventHandlers from 'helpers/github-event-handlers'

export default {
  method: 'POST',
  path: env.githubEventsPath,
  config: {
    validate: {
      headers: joi.object({
        'x-github-event': joi.string().required(),
        'x-github-delivery': joi.string().required()
      }).unknown(true)
    }
  },
  async handler (request, reply) {
    const eventId = request.headers['x-github-delivery']
    const eventName = request.headers['x-github-event']

    try {
      if (eventName === 'ping') {
        return reply()
      } else if (githubEventHandlers[eventName]) {
        console.info(`Received GitHub ${eventName} event ${eventId}`)
        await githubEventHandlers[eventName](request.payload)
        reply()
      } else {
        throw boom.badData(`GitHub event type ${eventName} is unsupported`)
      }
    } catch (error) {
      console.error(`Unable to process GitHub ${eventName} event ${eventId}. Reason:`, error)
      reply(boom.wrap(error))
    }
  }
}
