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

// -------
// DESTROY
// -------

export const canDestroyCourse = ({ courseKey }) => {
  return (
    hasMatchingRole(['instructor', 'admin']) &&
    !(
      courseHasEnrolledStudents(courseKey) &&
      courseHasBegun(courseKey)
    )
  )
}

// ---------------
// PRIVATE HELPERS
// ---------------

function findCourse (courseKey) {
  return store.state.courses.all.find(course => {
    return course['.key'] === courseKey
  })
}

function isEnrolledInCourse (courseKey) {
  const course = findCourse(courseKey)
  if (!course.studentKeys) return false
  const currentUserKey = store.state.users.currentUser['.key']
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
  return Date.parse(course.startDate) >= Date.now()
}

function courseHasEnded (courseKey) {
  const course = findCourse(courseKey)
  return Date.parse(course.endDate) <= Date.now()
}
