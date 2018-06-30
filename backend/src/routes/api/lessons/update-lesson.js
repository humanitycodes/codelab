import boom from 'boom'
import joi from 'joi'
import sequelize from '../../../db/sequelize'
import canUpdateLesson from '../../../helpers/permission/can-update-lesson'
import readLessonRecordById from '../../../db/lesson/read-by-id'
import refreshLessonRecord from '../../../db/lesson/refresh'
import updateLessonRecord from '../../../db/lesson/update'
import translateLessonFromRecord from '../../../translators/lesson/from-record'
import translateLessonFromPayload from '../../../translators/lesson/from-payload'
import createLearningObjectiveRecord from '../../../db/lesson/learning-objective/create'
import deleteLearningObjectiveRecord from '../../../db/lesson/learning-objective/delete'
import updateLearningObjectiveRecord from '../../../db/lesson/learning-objective/update'

export default {
  method: 'PUT',
  path: '/lessons/{lessonId}',
  options: {
    validate: {
      params: joi.object({
        lessonId: joi.number().integer().required()
      }).required(),
      payload: joi.object({
        lessonId: joi.number().integer().required(),
        lessonKey: joi.string().required(),
        title: joi.string().allow(null),
        estimatedHours: joi.number().integer().allow(null),
        content: joi.string().allow(null),
        notes: joi.string().allow(null),
        projectKey: joi.string().allow(null),
        projectTitle: joi.string().allow(null),
        projectHosting: joi.string().allow(null),
        version: joi.number().integer().allow(null),
        learningObjectives: joi.array().items(
          joi.object({
            lessonLearningObjectiveId: joi.number().integer().allow(null),
            lessonId: joi.number().integer().allow(null),
            position: joi.number().integer().min(0).required(),
            content: joi.string().min(1).required(),
            version: joi.number().integer().allow(null)
          }).required()
        ).allow(null)
      }).required()
    }
  },
  async handler (request, h) {
    const authUser = request.auth.credentials.user
    let transaction
    try {
      // Do not allow unauthorized users to know the lesson exists
      if (!canUpdateLesson(authUser)) {
        return boom.notFound()
      }

      transaction = await sequelize.transaction()

      const lessonId = request.params.lessonId
      const lessonRecord = await readLessonRecordById(lessonId, { transaction })

      if (!lessonRecord) {
        throw boom.notFound()
      }

      const updatedLesson = translateLessonFromPayload({ payload: request.payload })

      // Unique identifiers and version cannot be changed by clients
      if (updatedLesson.version !== lessonRecord.version) {
        throw boom.conflict('lesson.update.version.mismatch')
      } else if (updatedLesson.lessonId !== lessonRecord.lessonId) {
        throw boom.conflict('lesson.update.lessonId.mismatch')
      } else if (updatedLesson.lessonKey !== lessonRecord.lessonKey) {
        throw boom.conflict('lesson.update.lessonKey.mismatch')
      } else if (updatedLesson.projectKey !== lessonRecord.projectKey) {
        throw boom.conflict('lesson.update.projectKey.mismatch')
      }

      // Set updated fields on lesson record
      lessonRecord.title = updatedLesson.title
      lessonRecord.estimatedHours = updatedLesson.estimatedHours
      lessonRecord.content = updatedLesson.content
      lessonRecord.notes = updatedLesson.notes
      lessonRecord.projectTitle = updatedLesson.projectTitle
      lessonRecord.projectHosting = updatedLesson.projectHosting

      // Sync up the learning objectives
      if (lessonRecord.learningObjectives) {
        // Find records to delete
        const toDelete = lessonRecord.learningObjectives.filter(
          learningObjectiveRecord => {
            // Delete if ID is not in the updated lesson's learning objectives
            return !updatedLesson.learningObjectives.some(
              updatedLessonLearningObjective => {
                return updatedLessonLearningObjective.lessonLearningObjectiveId ===
                  learningObjectiveRecord.lessonLearningObjectiveId
              }
            )
          }
        )

        // Find records to update
        const toUpdate = lessonRecord.learningObjectives.filter(
          learningObjectiveRecord => {
            // Find the updated learning objective with a matching ID
            const updatedLearningObjective = updatedLesson.learningObjectives.find(
              updatedLessonLearningObjective => {
                return updatedLessonLearningObjective.lessonLearningObjectiveId ===
                  learningObjectiveRecord.lessonLearningObjectiveId
              }
            )
            // If the learning objective has a different position or content
            // then update the existing record and include it in the filter
            if (updatedLearningObjective && (
              learningObjectiveRecord.position !== updatedLearningObjective.position ||
              learningObjectiveRecord.content !== updatedLearningObjective.content
            )) {
              // Make sure the versions match
              if (learningObjectiveRecord.version !== updatedLearningObjective.version) {
                throw boom.conflict()
              }
              learningObjectiveRecord.position = updatedLearningObjective.position
              learningObjectiveRecord.content = updatedLearningObjective.content
              return true
            }
            // If no match found or no difference, exclude record from filter
            return false
          }
        )

        // Find records to insert (anything that doesn't have an ID)
        const toInsert = updatedLesson.learningObjectives.filter(
          updatedLessonLearningObjective => {
            return isNaN(parseInt(
              updatedLessonLearningObjective.lessonLearningObjectiveId
            ))
          }
        )

        // Perform all deletes, updates, and inserts in tandem
        await [
          toDelete.forEach(async learningObjectiveRecord => {
            await deleteLearningObjectiveRecord(
              learningObjectiveRecord, { transaction }
            )
          }),
          toUpdate.forEach(async learningObjectiveRecord => {
            await updateLearningObjectiveRecord(
              learningObjectiveRecord, { transaction }
            )
          }),
          toInsert.forEach(async learningObjective => {
            learningObjective.lessonId = lessonRecord.lessonId
            await createLearningObjectiveRecord(
              learningObjective, { transaction }
            )
          })
        ]
      }

      // Update, refresh, and send the lesson to the client
      await updateLessonRecord(lessonRecord, { transaction })
      await refreshLessonRecord(lessonRecord, { transaction })
      const lesson = translateLessonFromRecord({ lessonRecord })
      await transaction.commit()

      return lesson
    } catch (error) {
      console.error(
        `Unable to update lesson for user ${authUser.userId} (${authUser.fullName}).`,
        'Reason:', error
      )
      await transaction.rollback()
      return boom.wrap(error)
    }
  }
}
