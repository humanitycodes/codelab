import gradeMax from '@constants/grade-max'
import round from './round'

export default grade => {
  if (isNaN(grade)) return 0
  if (grade > gradeMax) return gradeMax
  return round(grade)
}
