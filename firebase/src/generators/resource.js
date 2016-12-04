import { noOtherFields } from './conditions'
import generateFields from './fields'
import generateMeta from './meta'

export default (modelName, def, category) => {
  delete def.type
  const keyVar = `$${modelName}Key`
  const resourceName = category || modelName
  return {
    [resourceName]: {
      // Admins can read/write all resources and
      // instructors can at least read by default
      [keyVar]: {
        ...generateMeta(def, keyVar),
        ...generateFields(def.fields),
        ...noOtherFields
      }
    }
  }
}
