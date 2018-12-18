import sequelize from 'db/sequelize'
import Course from './index'

export default ({ partialCourseKey, studentUserId }, options) => sequelize.query(
  `
    select
      *
    from
      course
    where
      course.course_key like :partialCourseKeyQuery
      and exists (
        select
          1
        from
          course_student
        where
          course_student.course_id = course.course_id
          and course_student.user_id = :studentUserId
      )
  `,
  {
    mapToModel: true,
    model: Course,
    replacements: {
      partialCourseKeyQuery: `${partialCourseKey}%`,
      studentUserId
    },
    ...options
  }
)
