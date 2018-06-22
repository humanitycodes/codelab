import Course from './index'
import User from '../user'

export default userId => {
  return Course.findAll({
    include: [
      {
        model: User,
        as: 'instructors'
      },
      {
        model: User,
        as: 'students',
        where: {
          userId
        }
      }
    ]
  })
}