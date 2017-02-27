import store from '@state/store'

export default (course, lesson) => {
  if (
    !lesson.prereqKeys ||
    !lesson.prereqKeys.length
  ) return []

  return lesson.prereqKeys
    .filter(prereqKey => {
      return course.lessonKeys.find(potentialPrereqKey => {
        return potentialPrereqKey === prereqKey
      })
    })
    .map(prereqKey => {
      return store.getters.lessons.find(lesson => {
        return lesson['.key'] === prereqKey
      })
    })
}
