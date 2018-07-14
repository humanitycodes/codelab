<template>
  <div v-if="projectStatus !== 'unstarted'" class="flex-row project-submission-breadcrumbs">
    <Breadcrumb
      :is-active="projectStatus === 'started'"
      :is-complete="projectStatus !== 'started'"
      pending-text="Push"
      active-text="Commit &amp; Push"
      complete-text="Pushed"
    />
    <Breadcrumb
      :is-active="projectStatus === 'startedWithCommit'"
      :is-complete="['pendingReview', 'changesRequested', 'approved'].indexOf(projectStatus) !== -1"
      pending-text="Submit"
      active-text="Submit for Review"
      complete-text="Submitted"
    />
    <Breadcrumb
      :is-active="['pendingReview', 'changesRequested'].indexOf(projectStatus) !== -1"
      :is-complete="projectStatus === 'approved'"
      pending-text="Get Feedback"
      :active-text="projectStatus === 'changesRequested' ? 'Respond to Feedback' : 'Awaiting Feedback'"
      complete-text="Project Approved!"
    />
  </div>
</template>

<script>
import Breadcrumb from './project-status-breadcrumb'

export default {
  components: {
    Breadcrumb
  },
  props: {
    projectStatus: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../meta'

.project-submission-breadcrumbs
  margin-bottom: 0
  > .flex-col
    &:first-child
      border-top-left-radius: $design.control.border.radius
    &:last-child
      border-top-right-radius: $design.control.border.radius

@media screen and (max-width: $design.project.breadcrumbs.breakpoint)
  .project-submission-breadcrumbs
    flex-direction: column
    > .flex-col
      &:first-child
        border-top-right-radius: $design.control.border.radius
      &:last-child
        border-top-right-radius: 0
</style>
