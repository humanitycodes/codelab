export default (array, iteratorFunc) => {
  return array.map(iteratorFunc)
    .reduce((a, b) => Object.assign({}, a, b))
}
