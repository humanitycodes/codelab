import decodeKey from '../utils/decode-key'

export default ({
  resourceItem,
  resourceKey
}) => {
  // Define the key as read-only
  Object.defineProperty(resourceItem, '.key', {
    value: decodeKey(resourceKey)
  })
}
