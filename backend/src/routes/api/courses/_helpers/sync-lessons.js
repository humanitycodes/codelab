export default async ({ courseRecord, updatedCourse, transaction }) => {
  const lessonRecords = await courseRecord.getLessons({ transaction })

  // Create lessons that don't already have a relationship
  const toCreate = updatedCourse.lessonIds.filter(
    lessonId => !lessonRecords.some(
      courseLessonRecord => courseLessonRecord.lessonId === lessonId
    )
  )

  // Delete relationships that don't exist in the updated course
  const toDelete = lessonRecords.filter(
    courseLessonRecord => !updatedCourse.lessonIds.some(
      lessonId => lessonId === courseLessonRecord.lessonId
    )
  ).map(courseLessonRecord => courseLessonRecord.lessonId)

  // Perform any needed deletes and inserts in tandem
  const changes = []
  if (toDelete.length > 0) {
    changes.push(courseRecord.removeLessons(toDelete, { transaction }))
  }
  if (toCreate.length > 0) {
    changes.push(courseRecord.addLessons(toCreate, { transaction }))
  }
  return Promise.all(changes)
}
