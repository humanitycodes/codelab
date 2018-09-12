import sequelize from 'db/sequelize'
import User from 'db/user'

// Users who can access a lesson:
//  1. All instructors
//  2. Students enrolled in a course with that lesson
export default async (lessonId, options) => sequelize.query(
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
          course_student,
          course_lesson
        where
          course_lesson.lesson_id = :lessonId
          and course_student.user_id = app_user.user_id
          and course_student.course_id = course_lesson.course_id
      )
  `,
  {
    mapToModel: true,
    model: User,
    replacements: { lessonId },
    ...options
  }
)
