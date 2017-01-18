<template>
  <component
    :is="currentInstructions"
    :project-completion="this.projectCompletion"
    :course="course"
    :lesson="lesson"
    :project="project"
    :project-name="projectName"
    :project-repo-url="projectRepoUrl"
    :project-hosted-url="projectHostedUrl"
    :class="currentStyleClass"
  />
</template>

<script>
import { userGetters } from '@state/helpers'

const statusInstructions = {
  unstarted: require('./project-instructions-unstarted'),
  started: require('./project-instructions-started'),
  startedWithCommit: require('./project-instructions-started-with-commit'),
  pendingReview: require('./project-instructions-pending-review'),
  changesRequested: require('./project-instructions-changes-requested'),
  approved: require('./project-instructions-approved')
}

export default {
  props: {
    course: {
      type: Object,
      required: true
    },
    lesson: {
      type: Object,
      required: true
    },
    project: {
      type: Object,
      required: true
    },
    projectStatus: {
      type: String,
      required: true
    },
    projectCompletion: Object
  },
  computed: {
    ...userGetters,
    currentInstructions () {
      return statusInstructions[this.projectStatus]
    },
    currentStyleClass () {
      return this.projectCompletion ? 'project-instructions' : ''
    },
    projectName () {
      return [
        this.course['.key'],
        this.lesson['.key'],
        this.project['.key'].slice(-6)
      ].join('-')
    },
    projectRepoUrl () {
      return [
        'https://github.com/',
        this.currentUser.profile.github.login,
        '/',
        this.projectName
      ].join('')
    },
    projectHostedSubdomain () {
      return (
        this.projectName.toLowerCase() +
        '-' +
        this.currentUser.profile.github.login
      )
    },
    projectHostedUrl () {
      if (!this.project || !this.projectCompletion) return ''
      if (this.projectCompletion.hostedUrl) {
        return this.projectCompletion.hostedUrl
      }
      if (this.project.hosting === 'Surge') {
        return (
          'https://' +
          this.projectHostedSubdomain +
          '.surge.sh/'
        )
      }
      if (this.project.hosting === 'Heroku') {
        return (
          'https://' +
          this.projectHostedSubdomain +
          '.herokuapp.com/'
        )
      }
      const githubUsername = this.currentUser.profile.github.login
      return this.projectCompletion.hostedUrl ||
      `https://${githubUsername}.github.io/${this.projectName}/`
    }
  }
}
</script>

<style lang="stylus">
@import '../meta'

.project-instructions
  padding: $design.layout.gutterWidth
  border: 1px solid $design.control.border.color
  border-top: none
  border-bottom-left-radius: $design.control.border.radius
  border-bottom-right-radius: $design.control.border.radius
  background-color: $design.branding.default.light
  > :first-child
    margin-top: 0
  > :last-child
    margin-bottom: 0
</style>
