import gradeMax from '@constants/grade-max'

export default grade => {
  if (isNaN(grade)) return 0
  if (grade > gradeMax) return gradeMax
  return Math.floor(grade * 100) / 100
}
