import store from '@state/store'

import courseUserGradeCurrentRounded from '@helpers/computed/course-user-grade-current-rounded'

describe('@helpers/computed/course-user-grade-current-rounded.js', () => {
  const course = {
    credits: 2,
    projectCompletions: []
  }

  const lessons = [
    { '.key': 'lesson1', estimatedHours: 7.0 },
    { '.key': 'lesson2', estimatedHours: 7.0 },
    { '.key': 'lesson3', estimatedHours: 8.0 },
    { '.key': 'lesson4', estimatedHours: 6.0 }
  ]
  if (!lessons.find) {
    // Array.prototype.find is undefined, provide substitute
    lessons.find = callback => {
      let foundLesson
      lessons.forEach(lesson => {
        if (callback(lesson)) {
          foundLesson = lesson
        }
      })
      return foundLesson
    }
  }

  const addProject = (lessonKey, studentKey, submitted, approved) => {
    let completion = {
      lessonKey: lessonKey,
      students: [{ '.key': studentKey }]
    }
    if (submitted) {
      completion.submission = {
        isApproved: approved
      }
    }
    course.projectCompletions.push(completion)
  }

  before(() => {
    store.getters.lessons = lessons
  })

  beforeEach(() => {
    course.projectCompletions = []
  })

  after(() => {
    delete store.getters.lessons
  })

  it('returns 0 for 0 projects started', () => {
    expect(courseUserGradeCurrentRounded(course, { '.key': 'user' })).to.equal(0)
  })

  it('returns 2.0 for half of lesson hours approved', () => {
    addProject('lesson1', 'user', true, true)
    addProject('lesson2', 'user', true, true)
    expect(courseUserGradeCurrentRounded(course, { '.key': 'user' })).to.equal(2)
  })

  it('returns 0.85 for 6 of 28 lesson hours approved', () => {
    addProject('lesson4', 'user', true, true)
    expect(courseUserGradeCurrentRounded(course, { '.key': 'user' })).to.equal(0.85)
  })

  it('returns 4.0 for all projects approved', () => {
    addProject('lesson1', 'user', true, true)
    addProject('lesson2', 'user', true, true)
    addProject('lesson3', 'user', true, true)
    addProject('lesson4', 'user', true, true)
    expect(courseUserGradeCurrentRounded(course, { '.key': 'user' })).to.equal(4)
  })

  it('ignores other student projects', () => {
    addProject('lesson1', 'user', true, true)
    addProject('lesson2', 'user', true, true)
    addProject('lesson1', 'other', true, true)
    expect(courseUserGradeCurrentRounded(course, { '.key': 'user' })).to.equal(2)
  })

  it('ignores unsubmitted projects', () => {
    addProject('lesson1', 'user', true, true)
    addProject('lesson2', 'user', true, true)
    addProject('lesson3', 'user', false)
    addProject('lesson4', 'user', false)
    expect(courseUserGradeCurrentRounded(course, { '.key': 'user' })).to.equal(2)
  })

  it('ignores unapproved projects', () => {
    addProject('lesson1', 'user', true, true)
    addProject('lesson2', 'user', true, true)
    addProject('lesson3', 'user', true, false)
    addProject('lesson4', 'user', true, false)
    expect(courseUserGradeCurrentRounded(course, { '.key': 'user' })).to.equal(2)
  })
})
