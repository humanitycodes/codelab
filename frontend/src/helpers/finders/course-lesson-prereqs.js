import store from '@state/store'

export default (course, lesson) => {
  if (
    !lesson.prerequisiteLessonIds ||
    !lesson.prerequisiteLessonIds.length
  ) return []

  return lesson.prerequisiteLessonIds
    .filter(prerequisiteLessonId =>
      course.lessonIds.indexOf(prerequisiteLessonId) !== -1
    )
    .map(prerequisiteLessonId =>
      store.getters.lessons.find(
        lesson => lesson.lessonId === prerequisiteLessonId
      )
    )
}
