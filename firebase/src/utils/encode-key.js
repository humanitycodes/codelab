export default key => {
  return encodeURIComponent(key).replace(/\./g, '%2E')
}
