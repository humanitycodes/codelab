import ProjectCompletion from './index'
import Course from '../course'
import User from '../user'

export default (instructorUserId, options) => ProjectCompletion.findAll({
  ...options,
  include: [
    {
      model: Course,
      include: [
        {
          model: User,
          as: 'instructors',
          where: {
            userId: instructorUserId
          },
          // Don't select user fields, we only want the completion
          attributes: []
        }
      ],
      // Don't select course fields, we only want the completion
      attributes: []
    }
  ]
})
