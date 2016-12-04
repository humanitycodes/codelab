import mapAndMerge from '../utils/map-and-merge'
import { noOtherFields } from './conditions'

export default fields => {
  if (!fields) return {}
  const fieldNames = Object.keys(fields)
  const generatedFields = mapAndMerge(fieldNames, name => {
    // Requiring here to deal with module recursion
    const generateField = require('./field').default
    return generateField(name, fields[name])
  })
  return {
    ...generatedFields,
    ...noOtherFields
  }
}
