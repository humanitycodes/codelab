import differenceInDays from 'date-fns/difference_in_days'

export default course => {
  const { startDate, endDate } = course
  const totalDays = differenceInDays(endDate, startDate) + 1
  return Math.max(0, totalDays)
}
