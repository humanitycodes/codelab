import store from '@state/store'
import courseUserGradeCurrentRounded from '@helpers/computed/course-user-grade-current-rounded'

describe('@helpers/computed/course-user-grade-current-rounded.js', () => {
  const user = {
    userId: 71
  }

  const lessons = [
    { lessonId: 1, estimatedHours: 7.0 },
    { lessonId: 2, estimatedHours: 7.0 },
    { lessonId: 3, estimatedHours: 8.0 },
    { lessonId: 4, estimatedHours: 6.0 },
    { lessonId: 200, estimatedHours: 3.0 },
    { lessonId: 201, estimatedHours: 2.0 },
    { lessonId: 203, estimatedHours: 2.0 },
    { lessonId: 204, estimatedHours: 2.0 },
    { lessonId: 205, estimatedHours: 1.0 },
    { lessonId: 207, estimatedHours: 1.0 },
    { lessonId: 208, estimatedHours: 2.0 },
    { lessonId: 209, estimatedHours: 1.0 },
    { lessonId: 210, estimatedHours: 1.0 },
    { lessonId: 211, estimatedHours: 1.0 },
    { lessonId: 212, estimatedHours: 2.0 },
    { lessonId: 213, estimatedHours: 2.0 },
    { lessonId: 214, estimatedHours: 3.0 },
    { lessonId: 217, estimatedHours: 2.0 },
    { lessonId: 218, estimatedHours: 2.0 },
    { lessonId: 219, estimatedHours: 3.0 },
    { lessonId: 220, estimatedHours: 2.0 },
    { lessonId: 221, estimatedHours: 3.0 },
    { lessonId: 222, estimatedHours: 3.0 },
    { lessonId: 224, estimatedHours: 3.0 },
    { lessonId: 239, estimatedHours: 1.0 }
  ]

  const addProject = (courseId, lessonId, studentUserId, submitted, approved) => {
    const projectCompletions = store.getters.projectCompletions
    const completion = { courseId, lessonId, studentUserId }

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
    const course = { courseId: 21, credits: 2 }
    expect(courseUserGradeCurrentRounded(course, user)).to.equal(0)
  })

  it('returns 2.0 for half of lesson hours approved', () => {
    const course = { courseId: 21, credits: 2 }
    addProject(course.courseId, lessons[0].lessonId, user.userId, true, true)
    addProject(course.courseId, lessons[1].lessonId, user.userId, true, true)
    expect(courseUserGradeCurrentRounded(course, user)).to.equal(2)
  })

  it('returns 0.86 for 6 of 28 lesson hours approved', () => {
    const course = { courseId: 21, credits: 2 }
    addProject(course.courseId, lessons[3].lessonId, user.userId, true, true)
    expect(courseUserGradeCurrentRounded(course, user)).to.equal(0.86)
  })

  it('returns 4.0 for all projects approved', () => {
    const course = { courseId: 21, credits: 2 }
    addProject(course.courseId, lessons[0].lessonId, user.userId, true, true)
    addProject(course.courseId, lessons[1].lessonId, user.userId, true, true)
    addProject(course.courseId, lessons[2].lessonId, user.userId, true, true)
    addProject(course.courseId, lessons[3].lessonId, user.userId, true, true)
    expect(courseUserGradeCurrentRounded(course, user)).to.equal(4)
  })

  it('returns 4.0 for real 3-credit course', () => {
    const course = { courseId: 5931, credits: 3 }
    addProject(course.courseId, 200, user.userId, true, true)
    addProject(course.courseId, 201, user.userId, true, true)
    addProject(course.courseId, 203, user.userId, true, true)
    addProject(course.courseId, 204, user.userId, true, true)
    addProject(course.courseId, 205, user.userId, true, true)
    addProject(course.courseId, 207, user.userId, true, true)
    addProject(course.courseId, 208, user.userId, true, true)
    addProject(course.courseId, 209, user.userId, true, true)
    addProject(course.courseId, 210, user.userId, true, true)
    addProject(course.courseId, 211, user.userId, true, true)
    addProject(course.courseId, 212, user.userId, true, true)
    addProject(course.courseId, 213, user.userId, true, true)
    addProject(course.courseId, 214, user.userId, true, true)
    addProject(course.courseId, 217, user.userId, true, true)
    addProject(course.courseId, 218, user.userId, true, true)
    addProject(course.courseId, 219, user.userId, true, true)
    addProject(course.courseId, 220, user.userId, true, true)
    addProject(course.courseId, 221, user.userId, true, true)
    addProject(course.courseId, 222, user.userId, true, true)
    addProject(course.courseId, 224, user.userId, true, true)
    addProject(course.courseId, 239, user.userId, true, true)
    expect(courseUserGradeCurrentRounded(course, user)).to.equal(4)
  })

  it('ignores other student projects', () => {
    const course = { courseId: 21, credits: 2 }
    const otherUserId = user.userId + 1
    addProject(course.courseId, lessons[0].lessonId, user.userId, true, true)
    addProject(course.courseId, lessons[1].lessonId, user.userId, true, true)
    addProject(course.courseId, lessons[0].lessonId, otherUserId, true, true)
    expect(courseUserGradeCurrentRounded(course, user)).to.equal(2)
  })

  it('ignores unsubmitted projects', () => {
    const course = { courseId: 21, credits: 2 }
    addProject(course.courseId, lessons[0].lessonId, user.userId, true, true)
    addProject(course.courseId, lessons[1].lessonId, user.userId, true, true)
    addProject(course.courseId, lessons[2].lessonId, user.userId, false)
    addProject(course.courseId, lessons[3].lessonId, user.userId, false)
    expect(courseUserGradeCurrentRounded(course, user)).to.equal(2)
  })

  it('ignores unapproved projects', () => {
    const course = { courseId: 21, credits: 2 }
    addProject(course.courseId, lessons[0].lessonId, user.userId, true, true)
    addProject(course.courseId, lessons[1].lessonId, user.userId, true, true)
    addProject(course.courseId, lessons[2].lessonId, user.userId, true, false)
    addProject(course.courseId, lessons[3].lessonId, user.userId, true, false)
    expect(courseUserGradeCurrentRounded(course, user)).to.equal(2)
  })
})
