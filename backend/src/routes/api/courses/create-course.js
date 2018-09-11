import boom from 'boom'
import joi from 'joi'
import sequelize from 'db/sequelize'
import canCreateCourse from 'helpers/permission/can-create-course'
import createCourseRecord from 'db/course/create'
import readCourseRecordByKey from 'db/course/read-by-key'
import refreshCourseRecord from 'db/course/refresh'
import readUserRecordById from 'db/user/read-by-id'
import translateCourseFromRecord from 'translators/course/from-record'
import translateCourseFromPayload from 'translators/course/from-payload'
import broadcastCourseCreated from 'notifications/courses/broadcast-created'
import readAllUserRecordsWithCourseAccess from 'db/user/read-all-with-course-access'

export default {
  method: 'POST',
  path: '/courses',
  options: {
    validate: {
      payload: joi.object({
        courseKey: joi.string().required(),
        instructors: joi.array().items(joi.object({
          userId: joi.number().integer().required()
        })).optional()
      }).required()
    }
  },
  async handler (request, h) {
    const authUser = request.auth.credentials.user
    let transaction
    try {
      if (!canCreateCourse(authUser)) {
        return boom.forbidden()
      }

      transaction = await sequelize.transaction()

      // Make sure the course key is not already in use
      const existingCourseRecord = await readCourseRecordByKey(
        request.payload.courseKey, { transaction }
      )
      if (existingCourseRecord) {
        throw boom.badData('course.create.courseKey.exists')
      }

      // Create the new course
      const newCourse = translateCourseFromPayload({ payload: request.payload })
      const courseRecord = await createCourseRecord(newCourse, { transaction })

      // Add instructors to the course
      if (request.payload.instructors) {
        const instructorUserRecords = await Promise.all(
          request.payload.instructors.map(async instructor => {
            const userRecord = await readUserRecordById(
              instructor.userId, { transaction }
            )
            // Abort if attempting to assign a non-instructor
            if (!userRecord.isInstructor) {
              throw boom.badData('course.create.instructor.missingRole')
            }
            return userRecord
          })
        )
        await courseRecord.setInstructors(instructorUserRecords, { transaction })
      }

      // Send the newly created course to the client
      await refreshCourseRecord(courseRecord, { transaction })
      const course = await translateCourseFromRecord({
        authUser, courseRecord, transaction
      })
      await transaction.commit()

      // Notify all affected users of the change
      const recipientUserRecords =
        await readAllUserRecordsWithCourseAccess(courseRecord.courseId)
      await broadcastCourseCreated({ courseRecord, recipientUserRecords })

      return course
    } catch (error) {
      console.error(
        `Unable to create course for user ${authUser.userId} (${authUser.fullName}).`,
        'Reason:', error
      )
      await transaction.rollback()
      return boom.wrap(error)
    }
  }
}
