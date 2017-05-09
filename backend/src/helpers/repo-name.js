export default (courseKey, lessonKey, projectKey) => {
  return [
    courseKey,
    lessonKey,
    projectKey.slice(-6)
  ].join('-')
}
