<template>
  <component
    :is="currentInstructions"
    :project-completion="projectCompletion"
    :course="course"
    :lesson="lesson"
    :project="project"
    :project-name="projectName"
    :project-repo-url="projectRepoUrl"
    :project-hosted-url="projectHostedUrl"
    :project-hosted-subdomain="projectHostedSubdomain"
    :class="currentStyleClass"
  />
</template>

<script>
import { userGetters } from '@state/helpers'
import projectName from '@helpers/project-name'
import projectRepoUrl from '@helpers/project-repo-url'
import projectHostedSubdomain from '@helpers/project-hosted-subdomain'
import projectHostedUrl from '@helpers/project-hosted-url'

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
      return projectName(this.course, this.lesson, this.project)
    },
    projectRepoUrl () {
      return projectRepoUrl(
        this.currentUser.profile.github.login,
        this.projectName
      )
    },
    projectHostedSubdomain () {
      return projectHostedSubdomain(
        this.project.hosting,
        this.currentUser.profile.email,
        this.project['.key'],
        this.projectName
      )
    },
    projectHostedUrl () {
      return projectHostedUrl(
        this.currentUser.profile,
        this.project,
        this.projectCompletion,
        this.projectName
      )
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
