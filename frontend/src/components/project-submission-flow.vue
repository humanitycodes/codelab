<template>
  <div v-if="course.instructorKeys.length">
    <ProjectStatusBreadcrumbs :project-status="projectStatus"/>
    <ProjectInstructions
      :project-completion="projectCompletion"
      :project-status="projectStatus"
      :course="course"
      :lesson="lesson"
      :project="project"
    />
  </div>
  <p v-else class="danger">
    You can't begin this project until at least one instructor is available for the course.
  </p>
</template>

<script>
import { userGetters } from '@state/helpers'
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
    },
    project: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...userGetters,
    projectCompletion () {
      return this.course.projectCompletions.find(completion => {
        return completion['.key'] === [
          this.project['.key'],
          this.currentUser.uid
        ].join('-')
      })
    },
    projectStatus () {
      if (!this.projectCompletion) return 'unstarted'
      if (!this.projectCompletion.submission) {
        return this.projectCompletion.committed
          ? 'startedWithCommit'
          : 'started'
      }
      return this.projectCompletion.submission.isApproved
        ? 'approved'
        : this.projectCompletion.submission.instructorCommentedLast
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

