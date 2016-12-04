import { isType, all } from './conditions'
import generatePermissions from './permissions'

export default (def, data = 'newData') => {
  if (typeof def !== 'object') {
    return { '.validate': isType(def, data) }
  }
  const validations = def.type || def.validate || def.matches
    ? {
      '.validate': all(
        def.type && isType(def.type, data),
        def.validate,
        def.matches && `${data}.matches(${def.matches})`
      )
    }
    : {}
  return {
    ...validations,
    ...generatePermissions(def.permissions, data)
  }
}
