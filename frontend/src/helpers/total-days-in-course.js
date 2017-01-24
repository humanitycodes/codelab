import differenceInDays from 'date-fns/difference_in_days'

export default (course) => {
  const { startDate, endDate } = course
  const totalDays = differenceInDays(endDate, startDate)
  return Math.max(0, totalDays)
}
