import store from '@state/store'
import courseLessonStatus from './course-lesson-status'

export default (course, lesson) => {
  return (
    // Lesson does not have any prereqs
    !lesson.prereqKeys ||
    !lesson.prereqKeys.length ||
    // Projects for prereqs are all approved
    lesson.prereqKeys
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
      .every(prereq => {
        return courseLessonStatus(course, prereq).approved
      })
  )
}
