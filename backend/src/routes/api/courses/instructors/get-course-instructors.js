import joi from 'joi'
import boom from 'boom'

import { readInstructorsByCourseKey } from 'db/instructor-repo'

export default {
  method: 'GET',
  path: '/courses/{courseKey}/instructors',
  config: {
    validate: {
      params: joi.object({
        courseKey: joi.string().required()
      }).required()
    }
  },
  async handler (request, reply) {
    const courseKey = request.params.courseKey

    try {
      let instructors = await readInstructorsByCourseKey(courseKey)
      // Don't let browser users see GitHub tokens
      Object.keys(instructors).forEach(instructorKey => {
        if (instructors[instructorKey].github) {
          delete instructors[instructorKey].github.scope
          delete instructors[instructorKey].github.token
          delete instructors[instructorKey].github.tokenType
        }
      })
      reply(instructors)
    } catch (error) {
      console.error(`Unable to get instructors for course ${courseKey}. Reason:`, error)
      reply(boom.wrap(error))
    }
  }
}
