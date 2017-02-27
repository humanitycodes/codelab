import maxGrade from '@constants/grade-max'

export default grade => {
  return Math.min(100, grade / maxGrade * 100)
}
