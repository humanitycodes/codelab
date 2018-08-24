<template>
  <div v-if="course.instructorIds.length">
    <ProjectStatusBreadcrumbs :project-status="projectStatus"/>
    <ProjectInstructions
      :project-completion="currentProjectCompletion"
      :project-status="projectStatus"
      :course="course"
      :lesson="lesson"
    />
  </div>
  <p v-else class="error">
    You can't begin this project until at least one instructor is available for
    the course.
  </p>
</template>

<script>
import { userGetters, projectCompletionGetters } from '@state/helpers'
import ProjectStatusBreadcrumbs from './project-status-breadcrumbs'
import ProjectInstructions from './project-instructions'

export default {
  components: {
    ProjectStatusBreadcrumbs, ProjectInstructions
  },
  props: {
    course: {
      type: Object,
      required: true
    },
    lesson: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...userGetters,
    ...projectCompletionGetters,
    projectStatus () {
      if (!this.currentProjectCompletion) return 'unstarted'
      if (!this.currentProjectCompletion.firstSubmittedAt) {
        return this.currentProjectCompletion.committed
          ? 'startedWithCommit'
          : 'started'
      }
      return this.currentProjectCompletion.approved
        ? 'approved'
        : this.currentProjectCompletion.instructorCommentedLast
          ? 'changesRequested'
          : 'pendingReview'
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../meta'

.project-submission-instructions
  border: 1px solid $design.control.border.color
  border-top: none
  padding: $design.layout.gutterWidth
  :first-child
    margin-top: 0
  :last-child
    margin-bottom: 0
</style>
