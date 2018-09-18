// The max message size is 4 KB. To be on the safe side, consider the string too
// big to broadcast if it is longer than 3,000 characters.
export default string => (string || '').length > 3000
