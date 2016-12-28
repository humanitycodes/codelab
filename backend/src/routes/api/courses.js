import joi from 'joi'
import boom from 'boom'

import { readInstructorsByCourseKey } from '../../db/instructor-repo'

export default {
  method: 'GET',
  path: '/courses/{courseKey}/instructors',
  config: {
    auth: {
      mode: 'required',
      strategy: 'jwt'
    },
    validate: {
      params: joi.object({
        courseKey: joi.string().required()
      }).required()
    }
  },
  handler: function* (request, reply) {
    const courseKey = request.params.courseKey

    try {
      const instructors = yield readInstructorsByCourseKey(courseKey)
      reply(instructors)
    } catch (error) {
      console.error(`Unable to get instructors for course ${courseKey}. Reason:`, error)
      reply(boom.wrap(error))
    }
  }
}
