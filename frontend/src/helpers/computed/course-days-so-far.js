import daysSince from './days-since'

export default course => {
  const { startDate } = course
  const daysSoFar = daysSince(startDate) + 1
  return Math.max(0, daysSoFar)
}
