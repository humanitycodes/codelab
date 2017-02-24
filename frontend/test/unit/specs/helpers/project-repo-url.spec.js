import projectRepoUrl from '@helpers/project-repo-url'

describe('project-repo-url.js', () => {
  it('uses whole login and repo name', () => {
    expect(projectRepoUrl('OctoCat', 'Project-Name')).to.equal('https://github.com/OctoCat/Project-Name')
  })
})
