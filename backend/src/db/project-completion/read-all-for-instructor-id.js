import ProjectCompletion from './index'
import Course from '../course'
import User from '../user'

export default (instructorUserId, options) => ProjectCompletion.findAll({
  ...options,
  include: [
    {
      model: Course,
      // The completion must have an instructor with the provided ID
      required: true,
      include: [
        {
          model: User,
          as: 'instructors',
          where: {
            userId: instructorUserId
          },
          required: true,
          // Don't select user fields, we only want the completion
          attributes: []
        }
      ],
      // Don't select course fields, we only want the completion
      attributes: []
    }
  ]
})
