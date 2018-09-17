import concat from 'lodash/concat'
import orderBy from 'lodash/orderBy'
import uniqBy from 'lodash/uniqBy'

export default (idField, array1, array2) =>
  uniqBy(
    orderBy(
      concat(array2, array1),
      [entity => entity[idField], entity => entity.version],
      ['asc', 'desc']
    ),
    entity => entity[idField]
  )
