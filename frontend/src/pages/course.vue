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
        <div v-if="!currentUserIsStudent" class="flex-col">
          <label class="with-inline-input">
            <input v-model="studentViewForced" type="checkbox">
            Force student view
          </label>
        </div>
      </div>
      <h1>
        {{ currentCourse.title }}
        <span
          v-if="shouldShowStudentView && currentGrade"
          class="course-projected-grade"
        >
          <span class="course-projected-grade-label">
            (projected grade:
          </span>{{
            projectedGrade.toFixed(1)
          }}<span class="course-projected-grade-label">)</span>
        </span>
      </h1>
      <div v-if="shouldShowStudentView && currentGrade">
        <p v-if="projectedGrade < 1" class="danger">
          At your current rate of progress, you will <strong>not</strong> pass the course. If you're not already working with an instructor to get back on track, reach out as soon as possible.
        </p>
        <p v-else-if="projectedGrade < 3" class="warning">
          At your current rate of progress, you will receive a <strong>{{ projectedGrade }}</strong> in the course. If you'd like help getting caught up, reach out to an instructor as soon as possible.
        </p>
      </div>
      <div v-if="shouldShowStudentView" class="flex-row" :title="'Your grade as of ' + formattedCurrentDate + ' is ' + currentGrade + ', which will be reported as a ' + currentGradeReported">
        <div class="flex-col">
          <div class="course-meter">
            <div class="course-meter-text">{{ formattedStartDate }}</div>
            <div
              class="meter-percent-through-course"
              :style="{ width: coursePercentThrough + '%' }"
            />
            <div class="course-meter-text">{{ formattedEndDate }}</div>
          </div>
          <div class="course-meter">
            <div
              class="course-meter-text"
              :class="{ active: currentGrade < gradeMilestones[0] }"
            >0</div>
            <div
              v-if="projectedGrade"
              :style="{ width: courseUserProjectedPercentToMaxGrade + '%' }"
              class="meter-projected-percent-to-max-grade"
            />
            <div
              :style="{
                left: courseUserPercentToMaxGrade + '%',
                width: percentGradeAddedWithHoveredLesson + '%'
              }"
              class="meter-percent-to-max-grade-with-hovered-lesson"
            />
            <div
              :style="{ width: courseUserPercentToMaxGrade + '%' }"
              class="meter-percent-to-max-grade"
            />
            <div
              v-for="(milestone, milestoneIndex) in gradeMilestones"
              :data-grade="milestone"
              :style="{ left: milestone / maxGrade * 100 + '%' }"
              :class="{
                active: (
                  currentGrade >= milestone &&
                  currentGrade < maxGrade &&
                  currentGrade < gradeMilestones[milestoneIndex + 1]
                )
              }"
              class="course-grade-milestone"
            />
            <div
              class="course-meter-text"
              :class="{ active: currentGrade >= maxGrade }"
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
          <LessonsMap
            :course="currentCourse"
            :lessons="courseLessons"
            @lesson-hover="hoveredLesson = $event"
          />
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
import Layout from '@layouts/main'
import CourseNotFound from '@components/course-not-found'
import LessonsMap from '@components/lessons-map'
import RenderedContent from '@components/rendered-content'
import { userGetters, courseGetters, lessonGetters } from '@state/helpers'
import courseUserGradeCurrentRounded from '@helpers/computed/course-user-grade-current-rounded'
import courseDaysTotal from '@helpers/computed/course-days-total'
import courseDaysSoFar from '@helpers/computed/course-days-so-far'
import coursePercentThrough from '@helpers/computed/course-percent-through'
import courseUserPercentToMaxGrade from '@helpers/computed/course-user-percent-to-max-grade'
import courseGradeMinExpectedRounded from '@helpers/computed/course-grade-min-expected-rounded'
import courseUserGradeProjectedReported from '@helpers/computed/course-user-grade-projected-reported'
import courseUserProjectedPercentToMaxGrade from '@helpers/computed/course-user-projected-percent-to-max-grade'
import courseLessonGradePointsReal from '@helpers/computed/course-lesson-grade-points-real'
import maxGrade from '@constants/grade-max'
import gradeMilestones from '@constants/grade-milestones'
import courseLessonUserStatus from '@helpers/computed/course-lesson-user-status'
import getGradeReported from '@helpers/utils/get-grade-reported'

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
      maxGrade,
      gradeMilestones,
      studentViewForced: false,
      hoveredLesson: null
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
    formattedCurrentDate () {
      return this.humanizeDate(new Date())
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
    shouldShowStudentView () {
      return this.currentUserIsStudent || this.studentViewForced
    },
    currentGrade () {
      return courseUserGradeCurrentRounded(this.currentCourse, this.currentUser)
    },
    currentGradeReported () {
      return getGradeReported(this.currentGrade)
    },
    courseDaysTotal () {
      return courseDaysTotal(this.currentCourse)
    },
    courseDaysSoFar () {
      return courseDaysSoFar(this.currentCourse)
    },
    courseGradeMinExpectedRounded () {
      return courseGradeMinExpectedRounded(this.currentCourse)
    },
    coursePercentThrough () {
      return coursePercentThrough(this.currentCourse)
    },
    courseUserPercentToMaxGrade () {
      return courseUserPercentToMaxGrade(this.currentCourse, this.currentUser)
    },
    percentGradeAddedWithHoveredLesson () {
      if (
        !this.hoveredLesson ||
        this.hoveredLessonStatus.approved
      ) return 0
      let addedGradePoints = courseLessonGradePointsReal(this.currentCourse, this.hoveredLesson)
      const alreadyAddedLessons = {}
      const addGradePointsOfPrereqs = lesson => {
        if (lesson.prereqKeys) {
          lesson.prereqKeys.forEach(prereqKey => {
            const prereq = this.courseLessons.find(lesson => {
              return lesson['.key'] === prereqKey
            })
            const prereqStatus = courseLessonUserStatus(this.currentCourse, prereq, this.currentUser)
            if (!prereqStatus.approved && !alreadyAddedLessons[prereq['.key']]) {
              addedGradePoints += courseLessonGradePointsReal(this.currentCourse, prereq)
              alreadyAddedLessons[prereq['.key']] = true
              addGradePointsOfPrereqs(prereq)
            }
          })
        }
      }
      addGradePointsOfPrereqs(this.hoveredLesson)
      return addedGradePoints / maxGrade * 100
    },
    courseUserProjectedPercentToMaxGrade () {
      return courseUserProjectedPercentToMaxGrade(this.currentCourse, this.currentUser)
    },
    projectedGrade () {
      return courseUserGradeProjectedReported(this.currentCourse, this.currentUser)
    },
    hoveredLessonStatus () {
      return courseLessonUserStatus(this.currentCourse, this.hoveredLesson, this.currentUser)
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

.course-projected-grade
  opacity: .7
  margin-left: $design.layout.gutterWidth
  font-size: .7em

.course-projected-grade-label
  font-weight: normal

.course-meter
  display: flex
  position: relative
  justify-content: space-between
  font-family: Lato
  color: $course-meter-text-color
  background: $course-meter-bg
  border: 1px solid $design.control.border.color
  border-top: 0
  z-index: 1
  &:first-child
    border-top: 1px solid $design.control.border.color
    border-top-left-radius: $design.control.border.radius
    border-top-right-radius: $design.control.border.radius
  &:last-child
    border-bottom-left-radius: $design.control.border.radius
    border-bottom-right-radius: $design.control.border.radius

.course-meter-text
  margin: auto 0
  padding: $design.layout.gutterWidth * .5 $design.layout.gutterWidth
  opacity: $course-meter-text-opacity
  line-height: $design.layout.gutterWidth
  &.active
    color: $course-meter-active-text-color
    font-weight: $course-meter-active-text-weight
    font-size: $course-meter-active-text-size
    opacity: 1

.meter-percent-through-course, .meter-percent-to-max-grade, .meter-projected-percent-to-max-grade, .meter-percent-to-max-grade-with-hovered-lesson
  position: absolute
  left: 0
  height: 100%
  z-index: -1

.meter-percent-through-course
  background-color: $course-meter-time-filled-bg

.meter-percent-to-max-grade
  background-color: $course-meter-grade-filled-bg

.meter-projected-percent-to-max-grade
  background-color: lighten($course-meter-grade-filled-bg, 80%)

.meter-percent-to-max-grade-with-hovered-lesson
  background-color: $course-meter-grade-filled-bg
  background-image: linear-gradient(-45deg, rgba(0, 0, 0, .05) 25%, transparent 25%, transparent 50%, rgba(0, 0, 0, .05) 50%, rgba(0, 0, 0, .05) 75%, transparent 75%, transparent)
  background-size: 8px 8px
  transition: width .3s ease-in-out

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
