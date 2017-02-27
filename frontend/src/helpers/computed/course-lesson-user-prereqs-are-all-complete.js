import courseLessonPrereqs from '../finders/course-lesson-prereqs'
import courseLessonUserStatus from './course-lesson-user-status'

export default (course, lesson, user) => {
  return courseLessonPrereqs(course, lesson)
    .every(prereq => courseLessonUserStatus(course, prereq, user).approved)
}
