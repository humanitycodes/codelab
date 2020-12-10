// Returns a new array with the supplied value removed.
// Assumes the value will only appear in the array once.
export default (array, value) => {
  if (!array) return []
  const index = array.indexOf(value)
  if (index < 0) {
    return array
  } else {
    return [
      ...array.slice(0, index),
      ...array.slice(index + 1)
    ]
  }
}
