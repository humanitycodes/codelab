// Used for the project completion's:
// - GitHub repository
// - Hosted URL (if using Github Pages)
// - Local directory in terminal instructions
export default (course, projectCompletion) => {
  return [
    course['.key'],
    projectCompletion.lessonKey,
    projectCompletion.projectKey.slice(-6)
  ].join('-')
}
