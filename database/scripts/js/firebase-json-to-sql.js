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
const quote = value => value ? `'${value}'` : 'null'

// Returns a numeric value if non-null, or the value 'null' otherwise
const num = value => isNaN(value) ? 'null' : value

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
console.log('delete from lesson_learning_objective;')
console.log('delete from lesson;')
console.log('delete from app_user;')
console.log()

//------------------------------------------------------------------------------
// USERS
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
