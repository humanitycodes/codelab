import moment from 'moment'

export default course => {
  const startMoment = moment(course.startDate)
  const endMoment = moment(course.endDate)
  const totalDays = endMoment.diff(startMoment, 'days') + 1
  return Math.max(0, totalDays)
}
