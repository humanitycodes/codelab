import courseProjectCompletionRepoName from '@helpers/computed/course-project-completion-repo-name'

describe('@helpers/computed/course-project-completion-repo-name.js', () => {
  it('uses up to last 6 characters of project key', () => {
    const course = { '.key': 'COURSEKEY' }
    const projectCompletion = {
      lessonKey: 'LESSONKEY',
      projectKey: 'PROJECTKEY'
    }

    expect(courseProjectCompletionRepoName(course, projectCompletion)).to.equal('COURSEKEY-LESSONKEY-ECTKEY')

    projectCompletion.projectKey = 'PROJ'
    expect(courseProjectCompletionRepoName(course, projectCompletion)).to.equal('COURSEKEY-LESSONKEY-PROJ')
  })
})
