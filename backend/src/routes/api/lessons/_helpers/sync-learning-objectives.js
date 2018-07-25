import findRecordsToCreate from './find-records-to-create'
import findRecordsToDelete from './find-records-to-delete'
import findRecordsToUpdate from './find-records-to-update'
import createLearningObjectiveRecord from 'db/lesson/learning-objective/create'
import deleteLearningObjectiveRecord from 'db/lesson/learning-objective/delete'
import updateLearningObjectiveRecord from 'db/lesson/learning-objective/update'

export default async ({ lessonRecord, updatedLesson, transaction }) => {
  const findParams = {
    existingRecords: await lessonRecord.getLearningObjectives({ transaction }),
    updatedObjects: updatedLesson.learningObjectives,
    key: 'lessonLearningObjectiveId'
  }
  const toCreate = findRecordsToCreate(findParams)
  const toDelete = findRecordsToDelete(findParams)
  const toUpdate = findRecordsToUpdate(findParams)

  // Perform all deletes, updates, and inserts in tandem
  return Promise.all([
    toDelete.map(async learningObjectiveRecord => {
      await deleteLearningObjectiveRecord(
        learningObjectiveRecord, { transaction }
      )
    }),
    toUpdate.map(async learningObjectiveRecord => {
      await updateLearningObjectiveRecord(
        learningObjectiveRecord, { transaction }
      )
    }),
    toCreate.map(async learningObjective => {
      learningObjective.lessonId = lessonRecord.lessonId
      await createLearningObjectiveRecord(
        learningObjective, { transaction }
      )
    })
  ])
}
