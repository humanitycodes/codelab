<template>
  <Layout>
    <div v-if="currentCourse">
      <EditCurrentCourseButton/>
      <div class="flex-row heading-basic-data">
        <div class="flex-col">
          {{ currentCourse['.key'] }}
          •
          {{ currentCourse.credits || '?' }} Credits
        </div>
      </div>
      <h1>{{ currentCourse.title }}</h1>
      <div v-if="currentUserIsStudent" class="flex-row">
        <div class="flex-col">
          <div class="course-meter">
            <div
              class="meter-percent-through-course"
              :style="{ width: percentThroughCourse + '%' }"
            />
            <div class="course-meter-text">{{ formattedStartDate }}</div>
            <div class="course-meter-text">{{ formattedEndDate }}</div>
          </div>
          <div class="course-meter">
            <div
              :style="{ width: percentToMaxGrade + '%' }"
              class="meter-percent-to-max-grade"
            />
            <div
              class="course-meter-text"
              :class="{ active: achievedGradePoints < gradeMilestones[0] }"
            >0</div>
            <div
              v-for="milestone in gradeMilestones"
              :data-grade="milestone"
              :style="{ left: milestone / maxGrade * 100 + '%' }"
              :class="{
                active: (
                  achievedGradePoints >= milestone &&
                  achievedGradePoints < milestone + gradeMilestones[0]
                )
              }"
              class="course-grade-milestone"
            />
            <div
              class="course-meter-text"
              :class="{ active: achievedGradePoints >= maxGrade }"
            >{{ maxGrade.toFixed(1) }}</div>
          </div>
        </div>
      </div>
      <div v-else class="flex-row">
        <div class="flex-col">
          <div class="course-date">
            <label>Start date</label>
            <span>{{ formattedStartDate }}</span>
          </div>
          <div class="course-date">
            <label>End date</label>
            <span>{{ formattedEndDate }}</span>
          </div>
        </div>
      </div>
      <div class="flex-row" v-if="courseLessons.length">
        <div class="flex-col">
          <LessonsMap :course="currentCourse" :lessons="courseLessons"/>
        </div>
      </div>
      <div class="flex-row">
        <div class="flex-col">
          <h2>Syllabus</h2>
          <div
            v-if="currentCourse.syllabus"
            class="course-syllabus-container"
          >
            <RenderedContent :content="currentCourse.syllabus"/>
          </div>
          <div v-else>Not yet defined</div>
        </div>
      </div>
      <EditCurrentCourseButton/>
    </div>
    <CourseNotFound v-else/>
  </Layout>
</template>

<script>
import formatDate from 'date-fns/format'
import differenceInDays from 'date-fns/difference_in_days'
import Layout from '@layouts/main'
import CourseNotFound from '@components/course-not-found'
import LessonsMap from '@components/lessons-map'
import RenderedContent from '@components/rendered-content'
import { userGetters, courseGetters, lessonGetters } from '@state/helpers'
import courseLessonGradePoints from '@helpers/course-lesson-grade-points'

const dateFormat = 'MMMM Do, YYYY'

export default {
  components: {
    Layout,
    CourseNotFound,
    LessonsMap,
    RenderedContent,
    EditCurrentCourseButton: {
      render (h) {
        if (!this.canUpdateCurrentCourse) return ''
        return (
          <router-link to={this.editCurrentCoursePath}>
            <button class='primary block'>
              Edit this course
            </button>
          </router-link>
        )
      },
      computed: courseGetters
    }
  },
  data () {
    return {
      maxGrade: 4,
      gradeMilestones: [0.5, 1, 1.5, 2, 2.5, 3, 3.5]
    }
  },
  computed: {
    ...userGetters,
    ...courseGetters,
    ...lessonGetters,
    courseLessons () {
      return this.lessons.filter(lesson => {
        return this.currentCourse.lessonKeys.indexOf(lesson['.key']) !== -1
      })
    },
    formattedStartDate () {
      return this.humanizeDate(this.currentCourse.startDate)
    },
    formattedEndDate () {
      return this.humanizeDate(this.currentCourse.endDate)
    },
    currentUserIsStudent () {
      return this.currentCourse.studentKeys.some(key => key === this.currentUser.uid)
    },
    achievedGradePoints () {
      const realGradePoints = this.currentCourse.projectCompletions.filter(completion => {
        return (
          completion.submission &&
          completion.submission.isApproved &&
          completion.students.some(student => {
            return student['.key'] === this.currentUser.uid
          })
        )
      }).map(completion => {
        const lesson = this.lessons.find(lesson => lesson['.key'] === completion.lessonKey)
        return courseLessonGradePoints(this.currentCourse, lesson)
      }).reduce((a, b) => a + b, 0)
      return isNaN(realGradePoints)
        ? 0
        : Math.floor(realGradePoints * 100) / 100
    },
    totalDaysInCourse () {
      const { startDate, endDate } = this.currentCourse
      const totalDays = differenceInDays(endDate, startDate)
      return Math.max(0, totalDays)
    },
    daysSoFarInCourse () {
      const { startDate } = this.currentCourse
      const daysSoFar = differenceInDays(Date.now(), startDate)
      return Math.max(0, daysSoFar)
    },
    minGradeExpectation () {
      const daysOfPadding = Math.min(21, this.totalDaysInCourse * 0.1)
      const realGradeExpectation = this.daysSoFarInCourse / (this.totalDaysInCourse - daysOfPadding) * this.maxGrade
      return isNaN(realGradeExpectation)
        ? 0
        : Math.floor(realGradeExpectation * 100) / 100
    },
    percentThroughCourse () {
      return Math.min(100, this.daysSoFarInCourse / this.totalDaysInCourse * 100)
    },
    percentToMaxGrade () {
      return Math.min(100, this.achievedGradePoints / this.maxGrade * 100)
    }
  },
  methods: {
    courseLessonPath (lesson) {
      return (
        '/courses/' + this.currentCourse['.key'] +
        '/lessons/' + lesson['.key']
      )
    },
    humanizeDate (date) {
      if (!date) return 'Not yet defined'
      return formatDate(date, dateFormat)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../meta'

$course-meter-bg = $design.branding.default.light
$course-meter-time-filled-bg = $design.branding.muted.light.note
$course-meter-grade-filled-bg = darken($design.branding.muted.light.success, 5%)
$course-meter-text-color = inherit
$course-meter-text-opacity = .7
$course-meter-active-text-color = $design.branding.success.light
$course-meter-active-text-weight = 600
$course-meter-active-text-size = 1.2em

.course-date
  > label
    display: inline-block
    width: 6em

.course-meter
  display: flex
  position: relative
  justify-content: space-between
  font-family: Lato
  color: $course-meter-text-color
  border: 1px solid $design.control.border.color
  border-top: 0
  z-index: 1
  &:before
    content: ''
    position: absolute
    left: 0
    right: 0
    height: 100%
    background-color: $course-meter-bg
    z-index: -1
  &:first-child
    border-top: 1px solid $design.control.border.color
    border-top-left-radius: $design.control.border.radius
    border-top-right-radius: $design.control.border.radius
  &:last-child
    border-bottom-left-radius: $design.control.border.radius
    border-bottom-right-radius: $design.control.border.radius

.course-meter-text
  padding: $design.layout.gutterWidth * .5 $design.layout.gutterWidth
  opacity: $course-meter-text-opacity
  &.active
    color: $course-meter-active-text-color
    font-weight: $course-meter-active-text-weight
    font-size: $course-meter-active-text-size
    opacity: 1

.meter-percent-through-course, .meter-percent-to-max-grade
  position: absolute
  height: 100%
  z-index: -1

.meter-percent-through-course
  background-color: $course-meter-time-filled-bg

.meter-percent-to-max-grade
  background-color: $course-meter-grade-filled-bg

.course-grade-milestone
  width: 2px
  height: 100%
  position: absolute
  background-color: $course-meter-grade-filled-bg
  &:after
    content: attr(data-grade)
    height: $design.layout.gutterWidth
    line-height: $design.layout.gutterWidth
    position: absolute
    top: 50%
    opacity: $course-meter-text-opacity
    margin-top: $design.layout.gutterWidth * -.5
    margin-left: 5px
  &.active
    &:after
      color: $course-meter-active-text-color
      opacity: 1
      font-weight: $course-meter-active-text-weight
      font-size: $course-meter-active-text-size

.course-syllabus-container
  background-color: rgba($design.branding.default.light, .7)
  padding: $design.layout.gutterWidth
  border: 1px solid $design.control.border.color
  border-radius: $design.control.border.radius
  > :first-child
    margin-top: 0
  > :last-child
    margin-bottom: 0
</style>
