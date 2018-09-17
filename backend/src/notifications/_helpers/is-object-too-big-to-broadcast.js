// The max message size is 4 KB. To be on the safe side, consider the object too
// big to broadcast if its JSON representation is more than 3,000 characters.
export default object => {
  const json = JSON.stringify(object) || ''
  return json.length > 3000
}
