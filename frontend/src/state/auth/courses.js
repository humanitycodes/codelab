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
        !course.lessonKeys.includes(lessonKey)
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
  return store.getters.courses.find(course => course.courseKey === courseKey)
}

function findLesson (lessonKey) {
  return store.getters.lessons.find(lesson => lesson.lessonKey === lessonKey)
}

function isEnrolledInCourse (courseKey) {
  const course = findCourse(courseKey)
  if (!course || !course.studentIds) return false
  const currentUserId = store.getters.currentUser.userId
  return course.studentIds.includes(currentUserId)
}

function courseHasEnrolledStudents (courseKey) {
  const course = findCourse(courseKey)
  return course.students && course.students.length > 0
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
