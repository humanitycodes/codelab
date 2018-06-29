import courseLessonProjectRepoName from './course-lesson-project-repo-name'

export default (user, course, lesson) => {
  const repoName = courseLessonProjectRepoName(course, lesson)
  return `https://github.com/${user.githubLogin}/${repoName}`
}
