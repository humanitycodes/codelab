import boom from 'boom'
import joi from 'joi'
import sequelize from '../../../db/sequelize'
import canUpdateCourse from '../../../helpers/permission/can-update-course'
import readCourseRecordById from '../../../db/course/read-by-id'
import refreshCourseRecord from '../../../db/course/refresh'
import updateCourseRecord from '../../../db/course/update'
import translateCourseFromRecord from '../../../translators/course/from-record'
import translateCourseFromPayload from '../../../translators/course/from-payload'
import isCourseInstructor from './_helpers/is-course-instructor'
import syncInstructors from './_helpers/sync-instructors'
import syncLessons from './_helpers/sync-lessons'
import syncStudents from './_helpers/sync-students'
import syncPendingStudents from './_helpers/sync-pending-students'

export default {
  method: 'PUT',
  path: '/courses/{courseId}',
  options: {
    validate: {
      params: joi.object({
        courseId: joi.number().integer().required()
      }).required(),
      payload: joi.object({
        courseId: joi.number().integer().required(),
        courseKey: joi.string().required(),
        title: joi.string().allow(null),
        credits: joi.number().integer().allow(null),
        startDate: joi.date().timestamp().allow(null),
        endDate: joi.date().timestamp().allow(null),
        syllabus: joi.string().allow(null),
        version: joi.number().integer().allow(null),
        instructorIds: joi.array().items(
          joi.number().integer()
        ).allow(null),
        studentIds: joi.array().items(
          joi.number().integer()
        ).allow(null),
        lessonIds: joi.array().items(
          joi.number().integer()
        ).allow(null),
        pendingStudentEmails: joi.array().items(
          joi.string()
        ).allow(null)
      }).required()
    }
  },
  async handler (request, h) {
    const authUser = request.auth.credentials.user
    const courseId = request.params.courseId
    let transaction

    try {
      // Do not allow unauthorized users to know the course exists
      if (!canUpdateCourse(authUser)) {
        return boom.notFound()
      }

      transaction = await sequelize.transaction()
      const courseRecord = await readCourseRecordById(courseId, { transaction })

      if (!courseRecord) {
        throw boom.notFound()
      }

      // Only instructors in a course can make updates
      if (!isCourseInstructor(courseRecord, authUser.userId)) {
        throw boom.unauthorized('course.update.instructor.unauthorized')
      }

      const updatedCourse = translateCourseFromPayload({ payload: request.payload })

      console.log('Updated course version:', updatedCourse.version)
      console.log('Existing course version:', courseRecord.version)
      // Unique identifiers and version cannot be changed by clients
      if (updatedCourse.version !== courseRecord.version) {
        throw boom.conflict('course.update.version.mismatch')
      } else if (updatedCourse.courseId !== courseRecord.courseId) {
        throw boom.conflict('course.update.courseId.mismatch')
      } else if (updatedCourse.courseKey !== courseRecord.courseKey) {
        throw boom.conflict('course.update.courseKey.mismatch')
      }

      // Set updated fields on course record
      courseRecord.title = updatedCourse.title
      courseRecord.credits = updatedCourse.credits
      courseRecord.startDate = updatedCourse.startDate
      courseRecord.endDate = updatedCourse.endDate
      courseRecord.syllabus = updatedCourse.syllabus

      // Sync the learning objectives and project criteria
      await Promise.all([
        syncInstructors({ courseRecord, updatedCourse, transaction }),
        syncLessons({ courseRecord, updatedCourse, transaction }),
        syncStudents({ courseRecord, updatedCourse, transaction }),
        syncPendingStudents({ courseRecord, updatedCourse, transaction })
      ])

      // Update, refresh, and send the course to the client
      await updateCourseRecord(courseRecord, { transaction })
      await refreshCourseRecord(courseRecord, { transaction })
      const course = translateCourseFromRecord({ authUser, courseRecord })
      await transaction.commit()

      return course
    } catch (error) {
      console.error(
        `Unable to update course ${courseId}`,
        `for user ${authUser.userId} (${authUser.fullName}).`,
        'Reason:', error
      )
      await transaction.rollback()
      return boom.wrap(error)
    }
  }
}
