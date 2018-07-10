import findRecordsToCreate from './find-records-to-create'
import findRecordsToDelete from './find-records-to-delete'
import findRecordsToUpdate from './find-records-to-update'
import createProjectCriterionRecord from 'db/lesson/project-criterion/create'
import deleteProjectCriterionRecord from 'db/lesson/project-criterion/delete'
import updateProjectCriterionRecord from 'db/lesson/project-criterion/update'

export default async ({ lessonRecord, updatedLesson, transaction }) => {
  const findParams = {
    existingRecords: lessonRecord.projectCriteria,
    updatedObjects: updatedLesson.projectCriteria,
    key: 'lessonProjectCriterionId'
  }
  const toCreate = findRecordsToCreate(findParams)
  const toDelete = findRecordsToDelete(findParams)
  const toUpdate = findRecordsToUpdate(findParams)

  // Perform all deletes, updates, and inserts in tandem
  return Promise.all([
    toDelete.map(async projectCriterionRecord => {
      await deleteProjectCriterionRecord(
        projectCriterionRecord, { transaction }
      )
    }),
    toUpdate.map(async projectCriterionRecord => {
      await updateProjectCriterionRecord(
        projectCriterionRecord, { transaction }
      )
    }),
    toCreate.map(async projectCriterion => {
      projectCriterion.lessonId = lessonRecord.lessonId
      await createProjectCriterionRecord(
        projectCriterion, { transaction }
      )
    })
  ])
}
