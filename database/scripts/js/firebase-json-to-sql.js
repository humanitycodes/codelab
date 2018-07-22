#!/usr/bin/env node

if (process.argv.length !== 3) {
  console.log(`usage: node firebase-json-to-sql <export.json>`)
  process.exit(1)
}

const filename = process.argv[2]
const data = require(`./${filename}`)
const { users, roles, lessons, courses } = data

// Returns a string value wrapped with apostrophes if non-null,
// or the value 'null' otherwise
const quote = value => {
  if (value && value.length) {
    const escaped = value.replace(/'/g, `''`)
    return `'${escaped}'`
  }
  return 'null'
}

// Returns a numeric value if non-null, or the value 'null' otherwise
const num = value => isNaN(value) ? 'null' : value

// Returns a datetime string from a non-null JS timestamp, or 'null' if null
const timestamp = value => {
  if (isNaN(value)) return 'null'
  return `to_timestamp(${parseInt(value / 1000)})`
}

// Returns a boolean true value if non-null and true, false otherwise
const bool = value => value === true

//------------------------------------------------------------------------------
// EMPTY DATABASE
//------------------------------------------------------------------------------

console.log(`-- Generated from ${filename}`)
console.log()

console.log('delete from project_completion;')
console.log('delete from course_instructor;')
console.log('delete from course_student_pending;')
console.log('delete from course_student;')
console.log('delete from course_lesson;')
console.log('delete from course;')
console.log('delete from lesson_prerequisite;')
console.log('delete from lesson_project_criterion;')
console.log('delete from LESSON_LEARNING_OBJECTIVE;')
console.log('delete from lesson;')
console.log('delete from app_user;')
console.log()

//------------------------------------------------------------------------------
// APP_USER
//------------------------------------------------------------------------------

const userKeys = Object.keys(users)

console.log(`-- Converting ${userKeys.length} users`)
console.log()

userKeys.forEach(userKey => {
  const user = users[userKey]
  const role = roles[userKey]
  const isInstructor = role && role.instructor
  const github = user.github || {}

  console.log(
    `insert into app_user (`,
    [
      `email`,
      `full_name`,
      `role_instructor`,
      `github_login`,
      `github_scope`,
      `github_token`,
      `github_token_type`,
      `github_user_id`,
      `msu_uid`,
      `version`
    ].join(`, `),
    `)`
  )
  console.log(
    `values (`,
    [
      quote(user.email),
      quote(user.fullName),
      isInstructor,
      quote(github.login),
      quote(github.scope),
      quote(github.token),
      quote(github.tokenType),
      num(github.userId),
      quote(user.msuUid),
      0
    ].join(`, `),
    `);`
  )
  console.log()
})

//------------------------------------------------------------------------------
// LESSON
//------------------------------------------------------------------------------

const lessonKeys = Object.keys(lessons.meta)

console.log(`-- Converting ${lessonKeys.length} lessons`)
console.log()

lessonKeys.forEach(lessonKey => {
  const smallStudentFields = lessons.fieldGroups.small.student[lessonKey]
  const largeStudentFields = lessons.fieldGroups.large.student[lessonKey]
  const largeInstructorFields = lessons.fieldGroups.large.instructor[lessonKey]
  const projectKey =
    largeStudentFields &&
    largeStudentFields.projects &&
    Object.keys(largeStudentFields.projects)[0]

  console.log(
    `insert into lesson (`,
    [
      `lesson_key`,
      `title`,
      `estimated_hours`,
      `content`,
      `notes`,
      `project_key`,
      `project_title`,
      `project_hosting`,
      `version`
    ].join(`, `),
    `)`
  )
  console.log(
    `values (`,
    [
      quote(lessonKey),
      quote(
        smallStudentFields &&
        smallStudentFields.title
      ),
      num(
        smallStudentFields &&
        smallStudentFields.estimatedHours
      ),
      quote(
        largeStudentFields &&
        largeStudentFields.content
      ),
      quote(
        largeInstructorFields &&
        largeInstructorFields.notes
      ),
      quote(projectKey),
      quote(
        projectKey &&
        largeStudentFields.projects[projectKey].title
      ),
      quote(
        projectKey &&
        largeStudentFields.projects[projectKey].hosting
      ),
      0
    ].join(`, `),
    `);`
  )
  console.log()
})

//------------------------------------------------------------------------------
// LESSON_LEARNING_OBJECTIVE
//------------------------------------------------------------------------------

console.log(`-- Converting lesson learning objectives`)
console.log()

lessonKeys.forEach(lessonKey => {
  const smallStudentFields = lessons.fieldGroups.small.student[lessonKey]

  if (
    smallStudentFields &&
    smallStudentFields.learningObjectives
  ) {
    const objectiveKeys = Object.keys(smallStudentFields.learningObjectives)

    objectiveKeys.forEach(objectiveKey => {
      const objective = smallStudentFields.learningObjectives[objectiveKey]
      console.log(
        `insert into lesson_learning_objective (`,
        [
          `lesson_id`,
          `position`,
          `content`,
          `version`
        ].join(`, `),
        `)`
      )
      console.log(
        `select`,
        [
          `lesson_id`,
          num(objective.position),
          quote(objective.content),
          0
        ].join(`, `)
      )
      console.log(
        `from lesson where lesson_key = '${lessonKey}';`
      )
      console.log()
    })
  }
})

//------------------------------------------------------------------------------
// LESSON_PROJECT_CRITERION
//------------------------------------------------------------------------------

console.log(`-- Converting lesson project criteria`)
console.log()

lessonKeys.forEach(lessonKey => {
  const largeStudentFields = lessons.fieldGroups.large.student[lessonKey]
  const projectKey =
    largeStudentFields &&
    largeStudentFields.projects &&
    Object.keys(largeStudentFields.projects)[0]

  if (
    projectKey &&
    largeStudentFields.projects[projectKey].criteria
  ) {
    const criteria = largeStudentFields.projects[projectKey].criteria
    const criterionKeys = Object.keys(criteria)

    criterionKeys.forEach(criterionKey => {
      const criterion = criteria[criterionKey]
      console.log(
        `insert into lesson_project_criterion (`,
        [
          `lesson_id`,
          `position`,
          `content`,
          `version`
        ].join(`, `),
        `)`
      )
      console.log(
        `select`,
        [
          `lesson_id`,
          num(criterion.position),
          quote(criterion.content),
          0
        ].join(`, `)
      )
      console.log(
        `from lesson where lesson_key = '${lessonKey}';`
      )
      console.log()
    })
  }
})

//------------------------------------------------------------------------------
// LESSON_PREREQUISITE
//------------------------------------------------------------------------------

console.log(`-- Converting lesson prerequisites`)
console.log()

lessonKeys.forEach(lessonKey => {
  const relationships = lessons.relationships[lessonKey]

  if (
    relationships &&
    relationships.prereqs
  ) {
    Object.keys(relationships.prereqs).forEach(prereqLessonKey => {
      console.log(
        `insert into lesson_prerequisite (`,
        [
          `lesson_id`,
          `prerequisite_lesson_id`,
          `version`
        ].join(`, `),
        `)`
      )
      console.log(
        `select`,
        [
          `l1.lesson_id`,
          `l2.lesson_id`,
          0
        ].join(`, `)
      )
      console.log(`from lesson l1, lesson l2`)
      console.log(`where l1.lesson_key = '${lessonKey}'`)
      console.log(`and l2.lesson_key = '${prereqLessonKey}';`)
      console.log()
    })
  }
})

//------------------------------------------------------------------------------
// COURSE
//------------------------------------------------------------------------------

const courseKeys = Object.keys(courses.meta)

console.log(`-- Converting ${courseKeys.length} courses`)
console.log()

courseKeys.forEach(courseKey => {
  const smallAuthedFields = courses.fieldGroups.small.authed[courseKey]
  const largeAuthedFields = courses.fieldGroups.large.authed[courseKey]

  console.log(
    `insert into course (`,
    [
      `course_key`,
      `title`,
      `credits`,
      `start_date`,
      `end_date`,
      `syllabus`,
      `version`,
    ].join(`, `),
    `)`
  )
  console.log(
    `values (`,
    [
      quote(courseKey),
      quote(
        smallAuthedFields &&
        smallAuthedFields.title
      ),
      num(
        smallAuthedFields &&
        smallAuthedFields.credits
      ),
      timestamp(
        smallAuthedFields &&
        smallAuthedFields.startDate
      ),
      timestamp(
        smallAuthedFields &&
        smallAuthedFields.endDate
      ),
      quote(
        largeAuthedFields &&
        largeAuthedFields.syllabus
      ),
      0
    ].join(`, `),
    `);`
  )
  console.log()
})

//------------------------------------------------------------------------------
// COURSE_LESSON
//------------------------------------------------------------------------------

console.log(`-- Converting course lessons`)
console.log()

courseKeys.forEach(courseKey => {
  const courseLessons =
    courses.relationships[courseKey] &&
    courses.relationships[courseKey].lessons

  if (courseLessons) {
    Object.keys(courseLessons).forEach(lessonKey => {
      console.log(
        `insert into course_lesson (`,
        [
          `course_id`,
          `lesson_id`,
          `version`
        ].join(`, `),
        `)`
      )
      console.log(
        `select`,
        [
          `c.course_id`,
          `l.lesson_id`,
          0
        ].join(`, `)
      )
      console.log(`from course c, lesson l`)
      console.log(`where c.course_key = '${courseKey}'`)
      console.log(`and l.lesson_key = '${lessonKey}';`)
      console.log()
    })
  }
})

//------------------------------------------------------------------------------
// COURSE_INSTRUCTOR
//------------------------------------------------------------------------------

console.log(`-- Converting course instructors`)
console.log()

courseKeys.forEach(courseKey => {
  const courseInstructors =
    courses.relationships[courseKey] &&
    courses.relationships[courseKey].instructors

  if (courseInstructors) {
    Object.keys(courseInstructors).forEach(userKey => {
      console.log(
        `insert into course_instructor (`,
        [
          `course_id`,
          `user_id`,
          `version`
        ].join(`, `),
        `)`
      )
      console.log(
        `select`,
        [
          `c.course_id`,
          `u.user_id`,
          0
        ].join(`, `)
      )
      console.log(`from course c, app_user u`)
      console.log(`where c.course_key = '${courseKey}'`)
      console.log(`and u.email = '${users[userKey].email}';`)
      console.log()
    })
  }
})

//------------------------------------------------------------------------------
// COURSE_STUDENT
//------------------------------------------------------------------------------

console.log(`-- Converting course students`)
console.log()

courseKeys.forEach(courseKey => {
  const courseStudents =
    courses.relationships[courseKey] &&
    courses.relationships[courseKey].students

  if (courseStudents) {
    Object.keys(courseStudents).forEach(userKey => {
      console.log(
        `insert into course_student (`,
        [
          `course_id`,
          `user_id`,
          `version`
        ].join(`, `),
        `)`
      )
      console.log(
        `select`,
        [
          `c.course_id`,
          `u.user_id`,
          0
        ].join(`, `)
      )
      console.log(`from course c, app_user u`)
      console.log(`where c.course_key = '${courseKey}'`)
      console.log(`and u.email = '${users[userKey].email}';`)
      console.log()
    })
  }
})

//------------------------------------------------------------------------------
// COURSE_STUDENT_PENDING
//------------------------------------------------------------------------------

console.log(`-- Converting pending course students`)
console.log()

courseKeys.forEach(courseKey => {
  const preenrollments =
    courses.fieldGroups.small.instructor &&
    courses.fieldGroups.small.instructor[courseKey] &&
    courses.fieldGroups.small.instructor[courseKey].preenrollments

  if (preenrollments) {
    Object.keys(preenrollments).forEach(encodedEmail => {
      console.log(
        `insert into course_student_pending (`,
        [
          `course_id`,
          `email`,
          `version`
        ].join(`, `),
        `)`
      )
      console.log(
        `select`,
        [
          `course_id`,
          quote(
            decodeURIComponent(encodedEmail)
          ),
          0
        ].join(`, `)
      )
      console.log(`from course where course_key = '${courseKey}';`)
      console.log()
    })
  }
})

//------------------------------------------------------------------------------
// PROJECT_COMPLETION
//------------------------------------------------------------------------------

console.log(`-- Converting project completions`)
console.log()

courseKeys.forEach(courseKey => {
  const completions =
    courses.fieldGroups.large.student &&
    courses.fieldGroups.large.student[courseKey] &&
    courses.fieldGroups.large.student[courseKey].projectCompletions

  if (completions) {
    Object.keys(completions).forEach(completionKey => {
      const completion = completions[completionKey]
      const studentUserKey = Object.keys(completion.students)[0]
      const submission = completion.submission || {}
      const instructorUserKey = submission.assignedInstructor

      // Make sure the assigned instructor is still related to the course
      if (instructorUserKey) {
        const courseInstructors =
          courses.relationships[courseKey] &&
          courses.relationships[courseKey].instructors
    
        if (
          !courseInstructors ||
          !courseInstructors[instructorUserKey]
        ) {
          console.log(
            `insert into course_instructor (`,
            [
              `course_id`,
              `user_id`,
              `version`
            ].join(`, `),
            `)`
          )
          console.log(
            `select`,
            [
              `c.course_id`,
              `u.user_id`,
              0
            ].join(`, `)
          )
          console.log(`from course c, app_user u`)
          console.log(`where c.course_key = '${courseKey}'`)
          console.log(`and u.email = '${users[instructorUserKey].email}'`)
          console.log(`on conflict do nothing;`)
          console.log()
        }
      }

      console.log(
        `insert into project_completion (`,
        [
          `course_id`,
          `lesson_id`,
          `student_user_id`,
          `repository_created_at`,
          `approved`,
          `committed`,
          `instructor_commented_last`,
          `first_committed_at`,
          `approved_at`,
          `instructor_user_id`,
          `first_submitted_at`,
          `last_commented_at`,
          `version`
        ].join(`, `),
        `)`
      )
      console.log(
        `select`,
        [
          `c.course_id`,
          `l.lesson_id`,
          `s.user_id`,
          timestamp(
            completion.repositoryCreatedAt ||
            completion.firstCommittedAt ||
            submission.firstSubmittedAt ||
            submission.lastCommentedAt ||
            submission.approvedAt ||
            Date.now()
          ),
          bool(submission.isApproved),
          bool(completion.committed),
          bool(submission.instructorCommentedLast),
          timestamp(completion.firstCommittedAt),
          timestamp(submission.approvedAt),
          instructorUserKey ? `i.user_id` : 'null',
          timestamp(submission.firstSubmittedAt),
          timestamp(submission.lastCommentedAt),
          0
        ].join(`, `)
      )
      console.log(
        `from course c, lesson l, ` +
        (instructorUserKey ? `app_user i, ` : '') +
        `app_user s`
      )
      console.log(`where c.course_key = '${courseKey}'`)
      console.log(`and l.lesson_key = '${completion.lessonKey}'`)
      if (instructorUserKey) {
        console.log(`and i.email = '${users[instructorUserKey].email}'`)
      }
      console.log(`and s.email = '${users[studentUserKey].email}';`)
      console.log()
    })
  }
})
