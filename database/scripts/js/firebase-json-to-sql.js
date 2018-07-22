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
