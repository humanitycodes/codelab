export default async ({ courseRecord, updatedCourse }) => {
  // Create lessons that don't already have a relationship
  const toCreate = updatedCourse.lessonIds.filter(
    lessonId => !courseRecord.lessons.some(
      courseLessonRecord => courseLessonRecord.lessonId === lessonId
    )
  )

  // Delete relationships that don't exist in the updated course
  const toDelete = courseRecord.lessons.filter(
    courseLessonRecord => !updatedCourse.lessonIds.some(
      lessonId => lessonId === courseLessonRecord.lessonId
    )
  ).map(courseLessonRecord => courseLessonRecord.lessonId)

  // Perform any needed deletes and inserts in tandem
  const changes = []
  if (toDelete.length > 0) {
    changes.push(courseRecord.removeLessons(toDelete))
  }
  if (toCreate.length > 0) {
    changes.push(courseRecord.addLessons(toCreate))
  }
  return Promise.all(changes)
}
