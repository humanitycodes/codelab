import store from '@state/store'
import { hasMatchingRole } from './_helpers'

// ------
// CREATE
// ------

export const canCreateLesson = () => {
  return hasMatchingRole(['instructor', 'admin'])
}

// ----
// READ
// ----

export const canReadLesson = ({ lessonKey }) => {
  return (
    hasMatchingRole(['instructor', 'admin']) ||
    isEnrolledInACourseWithLesson(lessonKey)
  )
}

export const canReadAllLessons = () => {
  return hasMatchingRole(['instructor', 'admin'])
}

// ------
// UPDATE
// ------

export const canUpdateLesson = ({ lessonKey }) => {
  return hasMatchingRole(['instructor', 'admin'])
}

// -------
// DESTROY
// -------

export const canDestroyLesson = ({ lessonKey }) => {
  return (
    hasMatchingRole(['instructor', 'admin']) &&
    !lessonIsInCourse(lessonKey)
  )
}

// ---------------
// PRIVATE HELPERS
// ---------------

function isEnrolledInACourseWithLesson (lessonKey) {
  const lesson = store.state.lessons.all.find(lesson => {
    return lesson['.key'] === lessonKey
  })
  if (!lesson) return
  // Just always return false because we can't yet check
  // if they're enrolled in a course
  return false
}

function lessonIsInCourse (lessonKey) {
  const lesson = store.state.lessons.all.find(lesson => {
    return lesson['.key'] === lessonKey
  })
  if (!lesson) return
  // Just always return false because we can't yet check
  // if the lesson is part of a course yet
  return false
}
