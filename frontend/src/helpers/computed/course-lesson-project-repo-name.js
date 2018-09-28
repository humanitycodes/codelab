// Returns the GitHub repository name for a given course and lesson.
//
// - The old, long repo name is formatted like this:
//   `{courseKey}-{lessonKey}-{last6of(projectKey)}`
//
// - The new, short repo name is formatted like this:
//   `{dept(courseKey)}-{courseNum(courseKey)}-{lessonKey}`
//
const newRepoStartDate = Date.parse('2018-10-01')

export default (course, lesson) => {
  // Use the old, long repo name if...
  const useLongRepoName = (
    // ...the lesson has a project key
    lesson.projectKey &&
    lesson.projectKey.length &&
    // ...the course started before October 1, 2018
    course.startDate < newRepoStartDate
  )

  if (useLongRepoName) {
    const courseKey = course.courseKey
    const lessonKey = lesson.lessonKey
    const projectKey = lesson.projectKey
    return `${courseKey}-${lessonKey}-${projectKey.slice(-6)}`
  } else {
    const courseParts = course.courseKey.split('-')
    return `${courseParts[0]}-${courseParts[1]}-${lesson.lessonKey}`
  }
}
