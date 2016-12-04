import store from '@state/store'
import { hasMatchingRole } from './_helpers'

// ------
// CREATE
// ------

export const canCreateCourse = () => {
  return hasMatchingRole(['instructor', 'admin'])
}

// ----
// READ
// ----

export const canReadCourse = ({ courseKey }) => {
  return (
    hasMatchingRole(['instructor', 'admin']) ||
    (
      isEnrolledInCourse(courseKey) &&
      courseHasBegun(courseKey)
    )
  )
}

export const canReadAllCourses = () => {
  return hasMatchingRole(['instructor', 'admin'])
}

// ------
// UPDATE
// ------

export const canUpdateCourse = ({ courseKey }) => {
  return hasMatchingRole(['instructor', 'admin'])
}

export const shouldUpdateCourse = ({ courseKey }) => {
  return (
    hasMatchingRole(['instructor', 'admin']) &&
    !(
      courseHasEnrolledStudents(courseKey) &&
      courseHasEnded(courseKey)
    )
  )
}

export const lessonCanBeAddedToCourse = ({ courseKey, lessonKey }) => {
  const course = findCourse(courseKey)
  const lesson = findLesson(lessonKey)
  return (
    // Lesson is not already added
    (
      !course.lessonKeys ||
      !course.lessonKeys[lessonKey]
    ) &&
    // Lesson has the required fields
    lesson.title &&
    lesson.content &&
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
  if (!course.studentKeys) return false
  const currentUserKey = store.state.users.currentUser.uid
  return course.studentKeys[currentUserKey]
}

function courseHasEnrolledStudents (courseKey) {
  const course = findCourse(courseKey)
  if (!course.studentKeys) return false
  const studentKeys = Object.keys(course.studentKeys)
  return (
    studentKeys.length &&
    studentKeys.some(key => course.studentKeys[key])
  )
}

function courseHasBegun (courseKey) {
  const course = findCourse(courseKey)
  return Date.parse(course.startDate) <= Date.now()
}

function courseHasEnded (courseKey) {
  const course = findCourse(courseKey)
  return Date.parse(course.endDate) <= Date.now()
}
