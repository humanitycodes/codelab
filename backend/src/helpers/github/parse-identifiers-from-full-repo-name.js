// Parses a full GitHub repository name (e.g. githubLogin/repo-name)
// and returns the different criteria used to created the repository.
// Two formats are currently supported:
//
// Old format:
// - Format:  {githubLogin}/{courseKey}-{lessonKey}-{last6of(projectKey)}
// - Example: GabeWardin/MI-449-SS18-740-js-create-an-api-with-express-URJy-_
//
// New format:
// - Format:  {githubLogin}/{dept(courseKey)}-{classNum(courseKey)}-{lessonKey}
// - Example: GabeWardin/MI-449-js-create-an-api-with-express
//
// The function will determine which format is used, pick out the
// criteria from the name, and return them in an object containing
// any of the following fields:
//
// ``` js
// {
//   githubLogin: 'GabeWardin',
//   partialCourseKey: 'MI-449',
//   lessonKey: 'js-create-an-api-with-express',
//   courseKey: 'MI-449-SS18-740',
//   partialProjectKey: 'URJy-_'
// }
// ```

// Capture Group 1. GitHub Username: ([^/]+)
// Capture Group 2. Course Key: ([A-Z]+-\d{3}-[A-Z]{2}\d{2}-\d{3})
// Capture Group 3. Lesson Key: ([a-z]+(?:-[a-z]+)*)
// Capture Group 4. Project Key Last 6: (\S{6})
const OLD_REPO_REGEX =
  /^([^/]+)\/([A-Z]+-\d{3}-[A-Z]{2}\d{2}-\d{3})-([a-z]+(?:-[a-z]+)*)-(\S{6})$/

// Capture Group 1. GitHub Login: ([^/]+)
// Capture Group 2. Partial Course Key: ([A-Z]+-\d{3})
// Capture Group 3. Lesson Key: ([a-z]+(?:-[a-z]+)*)
const NEW_REPO_REGEX =
  /^([^/]+)\/([A-Z]+-\d{3})-([a-z]+(?:-[a-z]+)*)$/

export default fullRepoName => {
  if (NEW_REPO_REGEX.test(fullRepoName)) {
    // Test the new repo format first
    const groups = NEW_REPO_REGEX.exec(fullRepoName)
    return {
      githubLogin: groups[1],
      partialCourseKey: groups[2],
      lessonKey: groups[3]
    }
  } else if (OLD_REPO_REGEX.test(fullRepoName)) {
    // Try to fallback to the old repo format
    const groups = OLD_REPO_REGEX.exec(fullRepoName)
    return {
      githubLogin: groups[1],
      courseKey: groups[2],
      lessonKey: groups[3],
      partialProjectKey: groups[4]
    }
  }
}
