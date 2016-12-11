import { isGreaterThan } from './conditions'
import generateFields from './fields'
import generateMeta from './meta'

export default (name, def) => {
  if (typeof def === 'object') {
    if (def.type === Array) {
      const generateResource = require('./resource').default
      return generateResource(name, {
        ...def,
        fields: {
          ...def.fields,
          ...def.orderable !== false
            ? {
              position: {
                type: 'Integer',
                validate: isGreaterThan(0)
              }
            }
            : {}
        }
      })
    }
    if (def.fields) {
      return {
        [name]: generateFields(def.fields)
      }
    }
  }
  return {
    [name]: generateMeta(def)
  }
}
