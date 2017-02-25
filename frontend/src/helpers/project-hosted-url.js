import projectHostedSubdomain from '@helpers/project-hosted-subdomain'

export default (userProfile, project, projectCompletion, projectName) => {
  if (!project || !projectCompletion) return ''
  if (projectCompletion.hostedUrl) {
    return projectCompletion.hostedUrl
  }

  const projectSubdomainOrName = projectHostedSubdomain(
    project.hosting,
    userProfile.email,
    project['.key'],
    projectName
  )

  if (project.hosting === 'Surge') {
    return `https://${projectSubdomainOrName}.surge.sh/`
  }
  if (project.hosting === 'Heroku') {
    return `https://${projectSubdomainOrName}.herokuapp.com/`
  }
  return `https://${userProfile.github.login}.github.io/${projectSubdomainOrName}/`
}
