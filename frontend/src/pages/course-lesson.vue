<template>
  <Layout>
    <EditCurrentLessonButton/>
    <div class="flex-row heading-basic-data">
      <div class="flex-col">
        <router-link :to="'/courses/'+currentCourse['.key']">
          {{ currentCourse['.key'] }}
        </router-link>
      </div>
      <div class="flex-col">
        {{ gradePoints }} Grade Points
      </div>
    </div>
    <h1>{{ currentLesson.title }}</h1>
    <RenderedContent
      :initial-page="Number($route.params.currentPage)"
      :content="currentLesson.content"
      @page-update="updateCurrentPage"
    />
    <div v-if="currentLesson.projects.length" class="flex-row">
      <div class="flex-col">
        <h3>
          Project:
          <span v-html="toHtml(currentLesson.projects[0].title)"/>
        </h3>
        <ol v-if="currentLesson.projects[0].criteria.length">
          <li
            v-for="criterion in currentLesson.projects[0].criteria"
            v-html="toHtml(criterion.content)"
          />
        </ol>
        <p v-else>No criteria for this project yet.</p>
        <ProjectSubmissionFlow
          v-if="
            currentLesson.projects.length &&
            currentUser.profile.github &&
            !hasNewGitHubScopes
          "
          :course="currentCourse"
          :lesson="currentLesson"
          :project="currentLesson.projects[0]"
        />
        <p v-if="!currentUser.profile.github" class="warning">
          You must connect your GitHub account before you can start a project.
        </p>
      </div>
    </div>
    <EditCurrentLessonButton/>
  </Layout>
</template>

<script>
import rho from 'rho'
import Layout from '@layouts/main'
import RenderedContent from '@components/rendered-content'
import ProjectSubmissionFlow from '@components/project-submission-flow'
import {
  userGetters, courseGetters, lessonGetters, courseLessonGetters
} from '@state/helpers'
import courseLessonGradePoints from '@helpers/course-lesson-grade-points'

export default {
  components: {
    Layout,
    RenderedContent,
    ProjectSubmissionFlow,
    EditCurrentLessonButton: {
      render (h) {
        if (!this.canUpdateCurrentLesson) return ''
        return (
          <router-link to={this.editCurrentLessonPath}>
            <button class='primary block'>
              Edit this lesson
            </button>
          </router-link>
        )
      },
      computed: lessonGetters
    }
  },
  computed: {
    ...userGetters,
    ...courseGetters,
    ...lessonGetters,
    ...courseLessonGetters,
    gradePoints () {
      const realGradePoints = courseLessonGradePoints(this.currentCourse, this.currentLesson)
      return isNaN(realGradePoints)
        ? 0
        : Math.floor(realGradePoints * 100) / 100
    }
  },
  methods: {
    toHtml: rho.toInlineHtml,
    updateCurrentPage (newPage) {
      const newUrl = (
        '/courses/' +
        this.currentCourse['.key'] +
        '/lessons/' +
        this.currentLesson['.key'] +
        '/' +
        newPage
      )
      window.history.replaceState({}, null, newUrl)
    }
  }
}
</script>

<style lang="stylus">
@import '../meta'

.rendered-content
  border: 1px solid $design.branding.muted.light.gray
  padding: $design.layout.gutterWidth
  img
    display: block
    margin: 0 auto
    padding: $design.layout.gutterWidth
</style>
