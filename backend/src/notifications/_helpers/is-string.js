export default value => (
  Object.prototype.toString.call(value) === '[object String]'
)
