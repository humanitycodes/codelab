import differenceInDays from 'date-fns/difference_in_days'

export default (course) => {
  const { startDate } = course
  const daysSoFar = differenceInDays(Date.now(), startDate)
  return Math.max(0, daysSoFar)
}
