import courseProjectCompletionRepoUrl from '@helpers/computed/course-project-completion-repo-url'
import store from '@state/store'
import arrayFindSubstitute from '../../_helpers/array-find-substitute'

describe('@helpers/computed/course-project-completion-repo-url.js', () => {
  const course = {
    courseId: 11,
    courseKey: 'MI-449-SS18-123'
  }

  const lesson = {
    lessonId: 21,
    lessonKey: 'html-intro'
  }

  const user = {
    userId: 31,
    githubLogin: 'OctoCat'
  }

  const projectCompletion = {
    courseId: course.courseId,
    lessonId: lesson.lessonId,
    studentUserId: user.userId
  }

  before(() => {
    store.commit('SET_ALL_COURSES', [course])
    store.commit('SET_ALL_LESSONS', [lesson])
    store.commit('SET_ALL_USERS', [user])
    store.commit('SET_CURRENT_USER', user)

    // Array.prototype.find is undefined, provide substitute
    store.state.lessons.all.find = arrayFindSubstitute(store.state.lessons.all)
  })

  after(() => {
    store.commit('SET_ALL_COURSES', [])
    store.commit('SET_ALL_LESSONS', [])
    store.commit('SET_ALL_USERS', [])
    store.commit('SET_CURRENT_USER', null)
  })

  it('uses whole login and repo name', () => {
    const repoUrl = courseProjectCompletionRepoUrl(course, projectCompletion)
    expect(repoUrl).to.equal('https://github.com/OctoCat/MI-449-html-intro')
  })
})
