import boom from 'boom'
import joi from 'joi'
import sequelize from '../../../db/sequelize'
import HttpStatus from 'http-status'
import canDeleteCourse from '../../../helpers/permission/can-delete-course'
import readCourseRecordById from '../../../db/course/read-by-id'
import deleteCourseRecord from '../../../db/course/delete'

export default {
  method: 'DELETE',
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
    let transaction

    try {
      // Do not allow unauthorized users to know the course exists
      if (!canDeleteCourse(authUser)) {
        return boom.notFound()
      }

      transaction = await sequelize.transaction()
      const courseRecord = await readCourseRecordById(courseId, { transaction })

      if (!courseRecord) {
        throw boom.notFound()
      }

      await deleteCourseRecord(courseRecord, { transaction })
      await transaction.commit()

      return h.response().code(HttpStatus.NO_CONTENT)
    } catch (error) {
      console.error(
        `Unable to delete course ${courseId}`,
        `for user ${authUser.userId} (${authUser.fullName}).`,
        'Reason:', error
      )
      await transaction.rollback()
      return boom.wrap(error)
    }
  }
}
