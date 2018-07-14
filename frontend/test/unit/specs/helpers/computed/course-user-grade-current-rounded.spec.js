import arrayFindSubstitute from '../../_helpers/array-find-substitute'
import store from '@state/store'
import courseUserGradeCurrentRounded from '@helpers/computed/course-user-grade-current-rounded'

describe('@helpers/computed/course-user-grade-current-rounded.js', () => {
  const course = {
    courseId: 21,
    credits: 2
  }

  const user = {
    userId: 71
  }

  const lessons = [
    { lessonId: 1, estimatedHours: 7.0 },
    { lessonId: 2, estimatedHours: 7.0 },
    { lessonId: 3, estimatedHours: 8.0 },
    { lessonId: 4, estimatedHours: 6.0 }
  ]

  // Array.prototype.find is undefined, provide substitute
  lessons.find = arrayFindSubstitute(lessons)

  const addProject = (lessonId, studentUserId, submitted, approved) => {
    const projectCompletions = store.getters.projectCompletions
    const completion = { courseId: 21, lessonId, studentUserId }

    if (submitted) {
      completion.firstSubmittedAt = Date.now()
      completion.approved = approved
    }

    projectCompletions.push(completion)
    store.commit('SET_ALL_PROJECT_COMPLETIONS', projectCompletions)
  }

  before(() => {
    store.commit('SET_ALL_LESSONS', lessons)
  })

  beforeEach(() => {
    store.commit('SET_ALL_PROJECT_COMPLETIONS', [])
  })

  after(() => {
    store.commit('SET_ALL_LESSONS', [])
    store.commit('SET_ALL_PROJECT_COMPLETIONS', [])
  })

  it('returns 0 for 0 projects started', () => {
    expect(courseUserGradeCurrentRounded(course, user)).to.equal(0)
  })

  it('returns 2.0 for half of lesson hours approved', () => {
    addProject(1, 71, true, true)
    addProject(2, 71, true, true)
    expect(courseUserGradeCurrentRounded(course, user)).to.equal(2)
  })

  it('returns 0.85 for 6 of 28 lesson hours approved', () => {
    addProject(4, 71, true, true)
    expect(courseUserGradeCurrentRounded(course, user)).to.equal(0.85)
  })

  it('returns 4.0 for all projects approved', () => {
    addProject(1, 71, true, true)
    addProject(2, 71, true, true)
    addProject(3, 71, true, true)
    addProject(4, 71, true, true)
    expect(courseUserGradeCurrentRounded(course, user)).to.equal(4)
  })

  it('ignores other student projects', () => {
    addProject(1, 71, true, true)
    addProject(2, 71, true, true)
    addProject(1, 75, true, true)
    expect(courseUserGradeCurrentRounded(course, user)).to.equal(2)
  })

  it('ignores unsubmitted projects', () => {
    addProject(1, 71, true, true)
    addProject(2, 71, true, true)
    addProject(3, 71, false)
    addProject(4, 71, false)
    expect(courseUserGradeCurrentRounded(course, user)).to.equal(2)
  })

  it('ignores unapproved projects', () => {
    addProject(1, 71, true, true)
    addProject(2, 71, true, true)
    addProject(3, 71, true, false)
    addProject(4, 71, true, false)
    expect(courseUserGradeCurrentRounded(course, user)).to.equal(2)
  })
})
