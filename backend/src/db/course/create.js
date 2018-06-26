import Course from './index'
import User from '../user'

export default (course, options) => Course.create(course, {
  ...options,
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
