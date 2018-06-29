import userById from '../finders/user-by-id'
import lessonById from '../finders/lesson-by-id'
import userCourseLessonProjectRepoUrl from './user-course-lesson-project-repo-url'

export default (course, projectCompletion) => {
  const user = userById(projectCompletion.studentUserId)
  const lesson = lessonById(projectCompletion.lessonId)
  return userCourseLessonProjectRepoUrl(user, course, lesson)
}
