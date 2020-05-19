// Adaptation of consistent scaled rounding technique:
// https://stackoverflow.com/a/11832950/1696044

export default (number, digits = 2) => {
  const scale = Math.pow(10, digits)
  return Math.round((number + Number.EPSILON) * scale) / scale
}
