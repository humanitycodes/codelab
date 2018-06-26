import User from '../user'

export default (courseRecord, options) => courseRecord.reload({
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
