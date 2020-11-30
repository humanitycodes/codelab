import boom from '@hapi/boom'
import joi from 'joi'
import canReadAllCourses from 'helpers/permission/can-read-all-courses'
import readCourseRecordById from 'db/course/read-by-id'
import readCourseRecordByIdForStudentId from 'db/course/read-by-id-for-student-id'
import translateCourseFromRecord from 'translators/course/from-record'

export default {
  method: 'GET',
  path: '/courses/{courseId}',
  options: {
    validate: {
      params: joi.object({
        courseId: joi.number().integer().required()
      }).required()
    }
  },
  async handler (request, h) {
    const authUser = request.auth.credentials.user
    const courseId = request.params.courseId

    try {
      let courseRecord
      if (canReadAllCourses(authUser)) {
        courseRecord = await readCourseRecordById(courseId)
      } else {
        courseRecord = await readCourseRecordByIdForStudentId({
          courseId,
          userId: authUser.userId
        })
      }

      if (!courseRecord) {
        return boom.notFound()
      }

      const course = await translateCourseFromRecord({ authUser, courseRecord })
      return course
    } catch (error) {
      console.error(
        `Unable to get course ${courseId}`,
        `for user ${authUser.userId} (${authUser.fullName}).`,
        'Reason:', error
      )
      return boom.wrap(error)
    }
  }
}
