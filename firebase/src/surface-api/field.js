import sortBy from 'lodash/sortBy'
import defineKey from './key'

const defineField = ({
  resourceItem,
  resourceName, resourceKey,
  fieldPathArray, fieldName, fieldDef, fieldValue,
  uid,
  db
}) => {
  let fieldRef = db.ref(resourceName)
  for (const fieldPathItem of fieldPathArray) {
    fieldRef = fieldRef.child(fieldPathItem)
  }
  fieldRef = fieldRef.child(fieldName)

  if (typeof fieldDef === 'object' && fieldDef.type === Array) {
    resourceItem[fieldName] = []
    const subFieldStateDefs = fieldValue || {}
    const subFieldDefs = fieldDef.fields
    const subFieldStateKeys = sortBy(Object.keys(subFieldStateDefs), key => {
      return subFieldStateDefs[key].position
    })
    for (const subFieldKey of subFieldStateKeys) {
      const subResourceItem = {}
      defineKey({
        resourceItem: subResourceItem,
        resourceKey: subFieldKey
      })
      Object.defineProperty(subResourceItem, '.position', {
        value: subFieldStateDefs[subFieldKey].position
      })
      const subFieldFields = subFieldStateDefs[subFieldKey]
      for (const subFieldFieldName in subFieldDefs) {
        const subFieldFieldValue = subFieldFields[subFieldFieldName]
        defineField({
          resourceItem: subResourceItem,
          resourceName, resourceKey,
          fieldPathArray: fieldPathArray.concat([
            fieldName, subFieldKey
          ]),
          fieldName: subFieldFieldName,
          fieldDef: subFieldDefs[subFieldFieldName],
          fieldValue: subFieldFieldValue,
          uid,
          db
        })
      }
      resourceItem[fieldName].push(subResourceItem)
    }

    resourceItem[fieldName].updateOrder = function () {
      let currentPosition = 1
      for (const item of resourceItem[fieldName]) {
        fieldRef
          .child(item['.key'])
          .child('position')
          .set(currentPosition++)
      }
    }
    resourceItem[fieldName].add = function (fields = {}) {
      const subFieldRecordCount = subFieldStateKeys.length
      fieldRef.push({
        ...fields,
        position: subFieldRecordCount + 1
      })
      updateMeta()
    }
    resourceItem[fieldName].remove = function (key) {
      fieldRef.child(key).remove()
      let currentPosition = 1
      for (const otherKey of subFieldStateKeys) {
        if (otherKey !== key) {
          fieldRef.child(otherKey).child('position').set(currentPosition++)
        }
      }
      updateMeta()
    }

    // - define order update
    // - define add
    // - define remove
    // - for each item
    //   - define key
    //   - define fields
    return
  }
  // Define the field as on the item/record, with a setter
  // that actually updates the field in Firebase
  Object.defineProperty(resourceItem, fieldName, {
    get: () => fieldValue,
    set (newValue) {
      fieldRef.set(newValue)
      updateMeta()
    },
    enumerable: true
  })

  function updateMeta () {
    db.ref(resourceName)
      .child('meta')
      .child(resourceKey)
      .update({
        updatedAt: Date.now(),
        updatedBy: uid
      })
  }
}

export default defineField