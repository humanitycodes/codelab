export default grade => {
  return isNaN(grade)
    ? 0
    : Math.floor(grade * 100) / 100
}
