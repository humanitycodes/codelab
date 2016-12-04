import { keyInResource } from './conditions'

export default {
  createdAt: Date,
  createdBy: {
    validate: keyInResource('newData.val()', 'users')
  },
  updatedAt: Date,
  updatedBy: {
    validate: keyInResource('newData.val()', 'users')
  }
}
