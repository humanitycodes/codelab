import projectName from '@helpers/project-name'

describe('project-name.js', () => {
  it('uses up to last 6 characters of project key', () => {
    const course = { '.key': 'COURSEKEY' }
    const lesson = { '.key': 'LESSONKEY' }
    const project = { '.key': 'PROJECTKEY' }
    expect(projectName(course, lesson, project)).to.equal('COURSEKEY-LESSONKEY-ECTKEY')

    project['.key'] = 'PROJ'
    expect(projectName(course, lesson, project)).to.equal('COURSEKEY-LESSONKEY-PROJ')
  })
})
