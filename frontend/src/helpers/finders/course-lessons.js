import lessonById from '../finders/lesson-by-id'

export default course => course.lessonIds.map(lessonId => lessonById(lessonId))
