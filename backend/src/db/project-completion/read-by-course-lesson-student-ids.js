import ProjectCompletion from './index'

export default ({ courseId, lessonId, studentUserId }, options) =>
  ProjectCompletion.findOne({
    ...options,
    where: {
      courseId,
      lessonId,
      studentUserId
    }
  })
