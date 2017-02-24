export default (course, lesson, project) => {
  return [
    course['.key'],
    lesson['.key'],
    project['.key'].slice(-6)
  ].join('-')
}
