import Course from './index'
import User from '../user'

export default (courseKey, options) => Course.findOne({
  ...options,
  where: {
    courseKey
  },
  include: [
    {
      model: User,
      as: 'instructors'
    },
    {
      model: User,
      as: 'students'
    }
  ]
})
