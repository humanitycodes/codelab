// Returns a new array with the item at the supplied index removed.
export default (array, index) => {
  if (!array) return []
  if (index < 0) return array
  return [
    ...array.slice(0, index),
    ...array.slice(index + 1)
  ]
}
