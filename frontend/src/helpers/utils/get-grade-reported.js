import sortBy from 'lodash/sortBy'
import maxGrade from '@constants/grade-max'
import gradeMilestones from '@constants/grade-milestones'

export default grade => {
  // Return max grade if equal to or higher than
  if (grade >= maxGrade) return maxGrade
  // Return 0 if the first milestone is not reached
  if (grade < gradeMilestones[0]) return 0
  // Otherwise, return the max milestone reached
  return sortBy(gradeMilestones, milestone => -1 * milestone)
    .find(milestone => grade >= milestone)
}
