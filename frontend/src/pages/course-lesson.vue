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
    <div class="flex-row course-lesson-tabs">
      <button
        class="flex-col course-lesson-tab"
        :class="{ active: currentView === 'content' }"
        @click="currentView = 'content'"
      >Content</button>
      <button
        class="flex-col course-lesson-tab"
        :class="{ active: currentView === 'project' }"
        @click="currentView = 'project'"
      >Project</button>
    </div>
    <div
      v-show="currentView === 'content'"
      class="course-lesson-tab-content"
    >
      <RenderedContent
        :initial-page="Number($route.params.currentPage)"
        :content="currentLesson.content"
        @page-update="updateCurrentPage"
        class="course-lesson-content"
      />
    </div>
    <div
      v-if="currentLesson.projects.length"
      v-show="currentView === 'project'"
      class="course-lesson-tab-content"
    >
      <h2>
        Project:
        <span v-html="toInlineHtml(currentLesson.projects[0].title)"/>
      </h2>
      <ol v-if="currentLesson.projects[0].criteria.length">
        <li
          v-for="criterion in currentLesson.projects[0].criteria"
          v-html="toInlineHtml(criterion.content)"
        />
      </ol>
      <p v-else>No criteria for this project yet.</p>
      <ProjectSubmissionFlow
        v-if="currentLesson.projects.length && isGitHubConnected"
        :course="currentCourse"
        :lesson="currentLesson"
        :project="currentLesson.projects[0]"
      />
      <p v-if="!isGitHubConnected" class="warning">
        You must
        <AuthLink provider="github">
          connect your GitHub account
        </AuthLink>
        before you can start a project.
      </p>
    </div>
    <EditCurrentLessonButton/>
  </Layout>
</template>

<script>
import Layout from '@layouts/main'
import AuthLink from '@components/auth-link'
import RenderedContent from '@components/rendered-content'
import ProjectSubmissionFlow from '@components/project-submission-flow'
import {
  userGetters, courseGetters, lessonGetters, courseLessonGetters
} from '@state/helpers'
import courseLessonGradePoints from '@helpers/course-lesson-grade-points'
import toInlineHtml from '@helpers/to-inline-html'
import getScrollTop from '@helpers/get-scroll-top'

export default {
  components: {
    Layout,
    AuthLink,
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
  data () {
    return {
      currentView: 'content'
    }
  },
  computed: {
    ...userGetters,
    ...courseGetters,
    ...lessonGetters,
    ...courseLessonGetters,
    isGitHubConnected () {
      return this.currentUser.profile.github && !this.hasNewGitHubScopes
    },
    gradePoints () {
      const realGradePoints = courseLessonGradePoints(this.currentCourse, this.currentLesson)
      return isNaN(realGradePoints)
        ? 0
        : Math.floor(realGradePoints * 100) / 100
    }
  },
  methods: {
    toInlineHtml,
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
      const scrollTop = getScrollTop()
      const contentTop = document.querySelector('.course-lesson-content .rendered-content').offsetTop
      if (scrollTop > contentTop) {
        window.scrollTo(0, contentTop)
      }
    }
  }
}
</script>

<style lang="stylus">
@import '../meta'

$course-tab-content-bg = rgba($design.branding.default.light, .7)

.course-lesson-tabs
  margin-bottom: 0

.course-lesson-tab.course-lesson-tab
  margin: 0
  margin-left: -1px
  border-bottom-color: $design.control.border.color
  border-bottom-left-radius: 0
  border-bottom-right-radius: 0
  background-color: rgba($design.branding.muted.light.gray, .7)
  &:focus
    border-color: $design.control.border.color
  &:hover
    position: relative
    z-index: 1
  &.active
    background-color: $course-tab-content-bg
    border-bottom-color: transparent
    cursor: default
    &:hover
      border-color: $design.control.border.color
      border-bottom-color: transparent

.course-lesson-tab-content.course-lesson-tab-content
  background: $course-tab-content-bg
  margin-bottom: $design.layout.gutterWidth
  padding: $design.layout.gutterWidth
  border: 1px solid $design.control.border.color
  border-top: none
  border-radius: $design.control.border.radius
  border-top-left-radius: 0
  border-top-right-radius: 0
  > :first-child
    margin-top: 0
  > :last-child
    margin-bottom: 0
</style>
