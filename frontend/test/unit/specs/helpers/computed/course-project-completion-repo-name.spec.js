import courseProjectCompletionRepoName from '@helpers/computed/course-project-completion-repo-name'

describe('@helpers/computed/course-project-completion-repo-name.js', () => {
  it('uses partial course key and lesson key from project completion', () => {
    const course = { courseKey: 'MI-449-SS18-001' }
    const lesson = { lessonKey: 'html-intro' }
    const projectCompletion = {}

    courseProjectCompletionRepoName.__Rewire__('lessonById', () => lesson)

    expect(courseProjectCompletionRepoName(course, projectCompletion))
      .to.equal('MI-449-html-intro')

    courseProjectCompletionRepoName.__ResetDependency__('lessonById')
  })
})
