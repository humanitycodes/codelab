import sequelize from 'db/sequelize'
import User from 'db/user'

// Users who can access a course:
//  1. All instructors
//  2. Students enrolled in the course
export default async (courseId, options) => sequelize.query(
  `
    select
      *
    from
      app_user
    where
    app_user.role_instructor = true
      or exists (
        select
          1
        from
          course_student
        where
          course_student.course_id = :courseId
          and course_student.user_id = app_user.user_id
      )
  `,
  {
    mapToModel: true,
    model: User,
    replacements: { courseId },
    ...options
  }
)
