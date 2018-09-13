import sequelize from 'db/sequelize'
import User from 'db/user'

// Users who can access a project completion:
//  1. All instructors in that project completion's course
//  2. The student assigned to that project completion
export default async (projectCompletionId, options) => sequelize.query(
  `
    select
      *
    from
      app_user
    where
      exists (
        select
          1
        from
          project_completion,
          course_instructor
        where
          project_completion.project_completion_id = :projectCompletionId
          and project_completion.course_id = course_instructor.course_id
          and course_instructor.user_id = app_user.user_id
      )
      or exists (
        select
          1
        from
          project_completion
        where
          project_completion.project_completion_id = :projectCompletionId
          and project_completion.student_user_id = app_user.user_id
      )
  `,
  {
    mapToModel: true,
    model: User,
    replacements: { projectCompletionId },
    ...options
  }
)
