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

export const canReadCourse = ({ courseId }) => {
  return doesCourseExist(courseId) &&
    (
      hasMatchingRole(['instructor']) ||
      (
        isEnrolledInCourse(courseId) &&
        courseHasBegun(courseId)
      )
    )
}

export const canReadAllCourses = () => {
  return hasMatchingRole(['instructor'])
}

// ------
// UPDATE
// ------

export const canUpdateCourse = ({ courseId }) => {
  return doesCourseExist(courseId) &&
    hasMatchingRole(['instructor'])
}

export const shouldUpdateCourse = ({ courseId }) => {
  return doesCourseExist(courseId) &&
    (
      hasMatchingRole(['instructor']) &&
      !(
        courseHasEnrolledStudents(courseId) &&
        courseHasEnded(courseId)
      )
    )
}

export const lessonCanBeAddedToCourse = ({ courseId, lessonKey }) => {
  const course = findCourse(courseId)
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

export const canDestroyCourse = ({ courseId }) => {
  // To prevents instructors from destroying a course when they shouldn't,
  // we're just goint go make this an admin-only change for now.
  return false
}

// ---------------
// PRIVATE HELPERS
// ---------------

function findCourse (courseId) {
  return store.state.courses.all.find(course => course.courseId === courseId)
}

function findLesson (lessonKey) {
  return store.getters.lessons.find(lesson => {
    return lesson['.key'] === lessonKey
  })
}

function isEnrolledInCourse (courseId) {
  const course = findCourse(courseId)
  if (!course || !course.students) return false
  const currentUserId = store.state.users.currentUser.userId
  return course.students.some(user => user.userId === currentUserId)
}

function courseHasEnrolledStudents (courseId) {
  const course = findCourse(courseId)
  return course.students && course.students.length > 0
}

function courseHasBegun (courseId) {
  const course = findCourse(courseId)
  return course.startDate <= Date.now()
}

function courseHasEnded (courseId) {
  const course = findCourse(courseId)
  return course.endDate <= Date.now()
}

function doesCourseExist (courseId) {
  return !!findCourse(courseId)
}
