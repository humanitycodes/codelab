// Capture Group 1. GitHub Login: ([^/]+)
// Capture Group 2. Partial Course Key: ([A-Z]+-\d{3})
// Capture Group 3. Lesson Key: ([a-z]+(?:-[a-z]+)*)
const REPO_REGEX = /^([^/]+)\/([A-Z]+-\d{3})-([a-z]+(?:-[a-z]+)*)$/

// fullRepoName: egillespie/MI-449-css-intro
export default fullRepoName => {
  if (!REPO_REGEX.test(fullRepoName)) return

  const groups = REPO_REGEX.exec(fullRepoName)
  return {
    githubLogin: groups[1],
    partialCourseKey: groups[2],
    lessonKey: groups[3]
  }
}
