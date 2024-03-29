<template>
  <Layout>
    <EditCurrentLessonButton/>
    <div class="stretch-row heading-basic-data">
      <div class="stretch-col">
        <router-link :to="'/courses/' + currentCourse.courseKey">
          {{ currentCourse.courseKey }}
        </router-link>
      </div>
      <div class="stretch-col">
        {{ gradePoints }} Grade Points
      </div>
    </div>
    <h1>{{ currentLesson.title }}</h1>
    <div class="stretch-row course-lesson-tabs">
      <button
        class="stretch-col course-lesson-tab"
        :class="{ active: currentView === 'content' }"
        @click="currentView = 'content'"
      >Content</button>
      <button
        class="stretch-col course-lesson-tab"
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
        @page-update="currentPage = $event"
        class="course-lesson-content"
      />
    </div>
    <div
      v-if="currentLesson.projectCriteria.length"
      v-show="currentView === 'project'"
      class="course-lesson-tab-content"
    >
      <h2>
        <span v-html="convertRichContentToInlineHtml(currentLesson.projectTitle)"/>
      </h2>
      <ol v-if="currentLesson.projectCriteria.length">
        <li
          v-for="criterion in sortedProjectCriteria"
          :key="criterion.lessonProjectCriterionId"
          v-html="convertRichContentToInlineHtml(criterion.content)"
        />
      </ol>
      <p v-else>No criteria for this project yet.</p>
      <ProjectSubmissionFlow
        v-if="currentLesson.projectCriteria.length && isGitHubConnected"
        :course="currentCourse"
        :lesson="currentLesson"
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
import store from '@state/store'
import Layout from '@layouts/main'
import AuthLink from '@components/auth-link'
import RenderedContent from '@components/rendered-content'
import ProjectSubmissionFlow from '@components/project-submission-flow'
import {
  userGetters, courseGetters, lessonGetters
} from '@state/helpers'
import courseLessonGradePointsRounded from '@helpers/computed/course-lesson-grade-points-rounded'
import convertRichContentToInlineHtml from '@helpers/utils/convert-rich-content-to-inline-html'
import getScrollTop from '@helpers/utils/dom/get-scroll-top'
import lessonByKey from '@helpers/finders/lesson-by-key'
import sortByPosition from '@helpers/utils/sort-by-position'

export default {
  beforeRouteEnter (to, from, next) {
    const lesson = lessonByKey(to.params.lessonKey)
    store.dispatch('syncLesson', lesson.lessonId)
    .then(() => {
      if (!lessonByKey(to.params.lessonKey)) {
        next({ name: 'not-found', params: [to.path] })
      } else {
        next()
      }
    })
  },
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
      currentPage: this.$route.params.currentPage,
      currentView: this.$route.params.currentView || 'content'
    }
  },
  computed: {
    ...userGetters,
    ...courseGetters,
    ...lessonGetters,
    isGitHubConnected () {
      return this.currentUser.githubLogin && !this.hasNewGitHubScopes
    },
    gradePoints () {
      return courseLessonGradePointsRounded(
        this.currentCourse,
        this.currentLesson
      )
    },
    sortedProjectCriteria () {
      return sortByPosition(this.currentLesson.projectCriteria)
    }
  },
  watch: {
    currentPage: 'updateCurrentPage',
    currentView (newView) {
      const newUrl = (
        '/courses/' +
        this.currentCourse.courseKey +
        '/lessons/' +
        this.currentLesson.lessonKey +
        '/' +
        this.currentPage +
        (newView === 'content' ? '' : '/' + newView)
      )
      window.history.replaceState({}, null, newUrl)
    }
  },
  methods: {
    convertRichContentToInlineHtml,
    updateCurrentPage (newPage) {
      const newUrl = (
        '/courses/' +
        this.currentCourse.courseKey +
        '/lessons/' +
        this.currentLesson.lessonKey +
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
  background-color: $design.branding.muted.light.gray
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
