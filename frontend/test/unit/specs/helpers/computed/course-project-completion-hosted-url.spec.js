import courseProjectCompletionHostedUrl from '@helpers/computed/course-project-completion-hosted-url'
import store from '@state/store'

describe('@helpers/computed/course-project-completion-hosted-url.js', () => {
  const user = {
    userId: 11,
    email: 'homer.j.simpson@nuke-plant.com',
    githubLogin: 'hjsimpson'
  }

  const course = {
    courseId: 31,
    courseKey: 'MI-449-SS18-123'
  }

  const surgeLesson = {
    lessonId: 21,
    lessonKey: 'html-intro',
    projectHosting: 'Surge'
  }
  const herokuLesson = {
    lessonId: 22,
    lessonKey: 'js-node-intro',
    projectHosting: 'Heroku'
  }
  const ghpagesLesson = {
    lessonId: 23,
    lessonKey: 'css-intro',
    projectHosting: 'GitHub Pages'
  }

  const lessons = [surgeLesson, herokuLesson, ghpagesLesson]

  const completionForLesson = lesson => {
    return {
      courseId: course.courseId,
      studentUserId: user.userId,
      lessonId: lesson.lessonId
    }
  }

  before(() => {
    store.commit('SET_ALL_LESSONS', lessons)
    store.commit('SET_ALL_USERS', [user])
    store.commit('SET_CURRENT_USER', user)
  })

  after(() => {
    store.commit('SET_ALL_LESSONS', [])
    store.commit('SET_ALL_USERS', [])
    store.commit('SET_CURRENT_USER', null)
  })

  it('returns empty string when no project or completion', () => {
    const url = courseProjectCompletionHostedUrl(course)
    expect(url).to.equal('')
  })

  it('returns correct Surge URL', () => {
    const completion = completionForLesson(surgeLesson)
    const url = courseProjectCompletionHostedUrl(course, completion)
    expect(url).to.equal('https://hjsimpson-html-intro.surge.sh/')
  })

  it('returns correct Heroku URL', () => {
    const completion = completionForLesson(herokuLesson)
    const url = courseProjectCompletionHostedUrl(course, completion)
    expect(url).to.equal('https://hjsimpson-js-node-intro.herokuapp.com/')
  })

  it('returns correct GitHub Pages URL', () => {
    const completion = completionForLesson(ghpagesLesson)
    const url = courseProjectCompletionHostedUrl(course, completion)
    expect(url).to.equal(
      'https://hjsimpson.github.io/MI-449-css-intro/index.html'
    )
  })
})
