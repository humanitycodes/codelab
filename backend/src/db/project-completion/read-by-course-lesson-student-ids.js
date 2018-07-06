import ProjectCompletion from './index'

export default ({ courseId, lessonId, studentUserId }, options) =>
  ProjectCompletion.findAll({
    ...options,
    where: {
      courseId,
      lessonId,
      studentUserId
    }
  })
