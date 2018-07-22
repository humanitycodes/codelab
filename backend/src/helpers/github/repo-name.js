// Returns the GitHub repository name in one of two formats, depending on
// whether the `projectKey` parameter is provided.
//
// Old format:
// - Format:  {courseKey}-{lessonKey}-{last6of(projectKey)}
// - Example: MI-449-SS18-740-js-create-an-api-with-express-URJy-_
//
// New format:
// - Format:  {dept(courseKey)}-{classNum(courseKey)}-{lessonKey}
// - Example: MI-449-js-create-an-api-with-express
export default ({ courseKey, lessonKey, projectKey }) => {
  if (projectKey && projectKey.length) {
    // Old format, maintained for past courses
    return `${courseKey}-${lessonKey}-${projectKey.slice(-6)}`
  } else {
    // New format, easier to read and type
    const courseParts = courseKey.split('-')
    return `${courseParts[0]}-${courseParts[1]}-${lessonKey}`
  }
}
