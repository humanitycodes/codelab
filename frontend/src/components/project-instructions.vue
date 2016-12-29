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
    class='project-instructions'
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
    projectHostedUrl () {
      if (!this.projectCompletion) return ''
      const githubUsername = this.currentUser.profile.github.login
      return this.projectCompletion.hostedUrl ||
        `https://${githubUsername}.github.io/${this.projectName}`
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../meta'

.project-instructions
  padding: $design.layout.gutterWidth
  border: 1px solid $design.control.border.color
  border-top: none
</style>
