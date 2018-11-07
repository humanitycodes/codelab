import orderBy from 'lodash/orderBy'

export default objectArray => orderBy(objectArray, [item => item.position])
