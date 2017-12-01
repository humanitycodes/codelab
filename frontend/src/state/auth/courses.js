import store from '@state/store'
import { hasMatchingRole } from './_helpers'

// ------
// CREATE
// ------

export const canCreateCourse = () => {
  return hasMatchingRole(['instructor'])
}

// ----
// READ
// ----

export const canReadCourse = ({ courseKey }) => {
  return doesCourseExist(courseKey) &&
    (
      hasMatchingRole(['instructor']) ||
      (
        isEnrolledInCourse(courseKey) &&
        courseHasBegun(courseKey)
      )
    )
}

export const canReadAllCourses = () => {
  return hasMatchingRole(['instructor'])
}

// ------
// UPDATE
// ------

export const canUpdateCourse = ({ courseKey }) => {
  return doesCourseExist(courseKey) &&
    hasMatchingRole(['instructor'])
}

export const shouldUpdateCourse = ({ courseKey }) => {
  return doesCourseExist(courseKey) &&
    (
      hasMatchingRole(['instructor']) &&
      !(
        courseHasEnrolledStudents(courseKey) &&
        courseHasEnded(courseKey)
      )
    )
}

export const lessonCanBeAddedToCourse = ({ courseKey, lessonKey }) => {
  const course = findCourse(courseKey)
  const lesson = findLesson(lessonKey)
  return course &&
    (
      // Lesson is not already added
      (
        !course.lessonKeys ||
        course.lessonKeys.indexOf(lessonKey) === -1
      ) &&
      // Lesson has the required fields
      lesson.title &&
      lesson.estimatedHours
    )
}

// -------
// DESTROY
// -------

export const canDestroyCourse = ({ courseKey }) => {
  // To prevents instructors from destroying a course when they shouldn't,
  // we're just goint go make this an admin-only change for now.
  return false
}

// ---------------
// PRIVATE HELPERS
// ---------------

function findCourse (courseKey) {
  return store.getters.courses.find(course => {
    return course['.key'] === courseKey
  })
}

function findLesson (lessonKey) {
  return store.getters.lessons.find(lesson => {
    return lesson['.key'] === lessonKey
  })
}

function isEnrolledInCourse (courseKey) {
  const course = findCourse(courseKey)
  if (!course || !course.studentKeys) return false
  const currentUserKey = store.state.users.currentUser.uid
  return course.studentKeys.includes(currentUserKey)
}

function courseHasEnrolledStudents (courseKey) {
  const course = findCourse(courseKey)
  if (!course.studentKeys) return false
  const studentKeys = Object.keys(course.studentKeys)
  return (
    studentKeys.length &&
    studentKeys.some(key => course.studentKeys.includes(key))
  )
}

function courseHasBegun (courseKey) {
  const course = findCourse(courseKey)
  return course.startDate <= Date.now()
}

function courseHasEnded (courseKey) {
  const course = findCourse(courseKey)
  return course.endDate <= Date.now()
}

function doesCourseExist (courseKey) {
  return !!findCourse(courseKey)
}
