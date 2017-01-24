export default gradePoints => {
  return isNaN(gradePoints)
    ? 0
    : Math.floor(gradePoints * 100) / 100
}
