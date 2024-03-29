import removeArrayIndex from './remove-array-index'

// Returns a new array with the supplied value removed.
// Assumes the value will only appear in the array once.
export default (array, value) => {
  if (!array) return []
  const index = array.indexOf(value)
  return removeArrayIndex(array, index)
}
