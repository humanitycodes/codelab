export default ({ courseKey, lessonKey }) => {
  const courseParts = courseKey.split('-')
  return `${courseParts[0]}-${courseParts[1]}-${lessonKey}`
}
