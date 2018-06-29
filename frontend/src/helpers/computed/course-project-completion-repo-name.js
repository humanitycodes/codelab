import lessonById from '../finders/lesson-by-id'
import courseLessonProjectRepoName from './course-lesson-project-repo-name'

// Used for the project completion's:
// - GitHub repository
// - Hosted URL (if using Github Pages)
// - Local directory in terminal instructions
export default (course, projectCompletion) => {
  const lesson = lessonById(projectCompletion.lessonId)
  return courseLessonProjectRepoName(course, lesson)
}
