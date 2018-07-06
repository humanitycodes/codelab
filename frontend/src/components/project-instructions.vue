<template>
  <div>
    <component
      :is="currentInstructions"
      :project-completion="projectCompletion"
      :course="course"
      :lesson="lesson"
      :project-name="projectName"
      :project-repo-url="projectRepoUrl"
      :project-hosted-url="projectHostedUrl"
      :project-hosted-subdomain="projectHostedSubdomain"
      :class="currentStyleClass"
    />
    <ProjectStartOverButton
      v-if="projectCanBeDeleted"
      :course="course"
      :project-completion="projectCompletion"
    />
  </div>
</template>

<script>
import { userGetters } from '@state/helpers'
import courseProjectCompletionRepoName from '@helpers/computed/course-project-completion-repo-name'
import courseProjectCompletionRepoUrl from '@helpers/computed/course-project-completion-repo-url'
import courseProjectCompletionHostedSubdomain from '@helpers/computed/course-project-completion-hosted-subdomain'
import courseProjectCompletionHostedUrl from '@helpers/computed/course-project-completion-hosted-url'
import ProjectStartOverButton from '@components/project-start-over-button'

const statusInstructions = {
  unstarted: require('./project-instructions-unstarted'),
  started: require('./project-instructions-started'),
  startedWithCommit: require('./project-instructions-started-with-commit'),
  pendingReview: require('./project-instructions-pending-review'),
  changesRequested: require('./project-instructions-changes-requested'),
  approved: require('./project-instructions-approved')
}

export default {
  components: {
    ProjectStartOverButton
  },
  props: {
    course: {
      type: Object,
      required: true
    },
    lesson: {
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
    projectCanBeDeleted () {
      return this.projectStatus !== 'unstarted' &&
        this.projectStatus !== 'approved'
    },
    projectName () {
      if (!this.projectCompletion) return
      return courseProjectCompletionRepoName(
        this.course,
        this.projectCompletion
      )
    },
    projectRepoUrl () {
      if (!this.projectCompletion) return
      return courseProjectCompletionRepoUrl(
        this.course,
        this.projectCompletion
      )
    },
    projectHostedSubdomain () {
      if (!this.projectCompletion) return
      return courseProjectCompletionHostedSubdomain(
        this.course,
        this.projectCompletion
      )
    },
    projectHostedUrl () {
      if (!this.projectCompletion) return
      return courseProjectCompletionHostedUrl(
        this.course,
        this.projectCompletion
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
