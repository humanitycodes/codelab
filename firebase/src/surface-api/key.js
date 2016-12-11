export default ({
  resourceItem,
  resourceKey
}) => {
  // Define the key as read-only
  Object.defineProperty(resourceItem, '.key', {
    value: resourceKey
  })
}
