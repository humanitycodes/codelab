import joi from 'joi'
import boom from 'boom'

import { config } from '../../../../env/config'
import githubEventHandlerMap from './_helpers/github-event-handler-map'

export default {
  method: 'POST',
  path: config.githubEventsPath,
  config: {
    auth: false,
    validate: {
      headers: joi.object({
        'x-github-event': joi.string().required(),
        'x-github-delivery': joi.string().required()
      }).unknown(true)
    }
  },
  async handler (request, h) {
    const eventId = request.headers['x-github-delivery']
    const eventName = request.headers['x-github-event']

    try {
      if (eventName === 'ping') {
        return h.response()
      } else if (githubEventHandlerMap[eventName]) {
        console.info(`Received GitHub ${eventName} event ${eventId}`)
        await githubEventHandlerMap[eventName](request.payload)
        return h.response()
      } else {
        throw boom.badData(`githubEvent.${eventName}.unsupported`)
      }
    } catch (error) {
      console.error(
        `Unable to process GitHub ${eventName} event ${eventId}.`,
        'Reason:', error
      )
      return boom.wrap(error)
    }
  }
}
