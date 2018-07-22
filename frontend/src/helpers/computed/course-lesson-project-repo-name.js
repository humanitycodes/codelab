// Returns the GitHub repository name for a given course and lesson.
//
// - If the lesson contains a project key, then the old style of name:
//   `{courseKey}-{lessonKey}-{last6of(projectKey)}` will be used.
// - If there is no project key, then the new style of name:
//   `{dept(courseKey)}-{courseNum(courseKey)}-{lessonKey}` will be used.
//
// These two formats are used to support old classes (mid-2018 and earlier)
// and classes held after mid-2018.
export default (course, lesson) => {
  if (lesson.projectKey && lesson.projectKey.length) {
    const courseKey = course.courseKey
    const lessonKey = lesson.lessonKey
    const projectKey = lesson.projectKey
    return `${courseKey}-${lessonKey}-${projectKey.slice(-6)}`
  } else {
    const courseParts = course.courseKey.split('-')
    return `${courseParts[0]}-${courseParts[1]}-${lesson.lessonKey}`
  }
}
