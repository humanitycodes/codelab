<template>
  <div>
    <ProjectStatusBreadcrumbs :project-status="projectStatus"/>
    <ProjectInstructions
      :project-completion="projectCompletion"
      :project-status="projectStatus"
      :course="course"
      :lesson="lesson"
      :project="project"
    />
    <p v-if="error" class="danger">{{ error }}</p>
  </div>
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
  data () {
    return {
      readyToSubmit: false,
      error: null
    }
  },
  computed: {
    ...userGetters,
    projectCompletion () {
      const rawProjectCompletion = this.course.projectCompletions.find(completion => {
        return completion['.key'] === [this.project['.key'], this.currentUser.uid].join('-')
      })
      if (rawProjectCompletion) {
        const projectCompletion = { ...rawProjectCompletion }
        projectCompletion.studentKey = projectCompletion.students[0]['.key']
        delete projectCompletion.students
        return projectCompletion
      }
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
        : this.projectCompletion.instructorCommentedLast
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

