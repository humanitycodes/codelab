export default async ({ lessonRecord, updatedLesson, transaction }) => {
  const prerequisiteLessons = await lessonRecord.getPrerequisiteLessons({
    transaction
  })

  // Create prereqs that don't already have a relationship
  const toCreate = updatedLesson.prerequisiteLessonIds.filter(
    prerequisiteLessonId => !prerequisiteLessons.some(
      prerequisiteLesson => prerequisiteLesson.lessonId === prerequisiteLessonId
    )
  )

  // Delete relationships that don't exist in the updated lesson
  const toDelete = prerequisiteLessons.filter(
    prerequisiteLesson => !updatedLesson.prerequisiteLessonIds.some(
      prerequisiteLessonId => prerequisiteLessonId === prerequisiteLesson.lessonId
    )
  ).map(prerequisiteLesson => prerequisiteLesson.lessonId)

  // Perform any needed deletes and inserts in tandem
  const changes = []
  if (toDelete.length > 0) {
    changes.push(lessonRecord.removePrerequisiteLessons(toDelete))
  }
  if (toCreate.length > 0) {
    changes.push(lessonRecord.addPrerequisiteLessons(toCreate))
  }
  return Promise.all(changes)
}
