<template>
  <details v-if="isCourseInProgress && studentsInCourse.length">
    <summary>{{ course['.key'] }}</summary>
    <table class="dashboard-info">
      <thead>
        <th>
          Name
        </th>
        <th class="numeric-cell">
          Grade Points<br>
          Expected: {{ expectedGrade }}
        </th>
        <th class="numeric-cell" title="The number of lesson behind/ahead the student is">
          Proj.<br>
          Delta
        </th>
        <th class="numeric-cell" title="The number of lessons that have been started, but are unapproved">
          Proj.<br>
          Active
        </th>
        <th class="numeric-cell" title="Maximum number of days since a project has had changes requested">
          Days<br> Stale
        </th>
        <th class="numeric-cell" title="Maximum number of days a submitted project has gone unapproved">
          Days<br> Open
        </th>
        <th class="numeric-cell" title="Number of days since an update was made to a project">
          Days<br> Inactive
        </th>
      </thead>
      <tbody>
        <tr v-for="student in studentsInCourse">
          <td :class="{ 'warning-grade': behindByLessonCount(student) <= lessonWarningThreshold }">
            <a
              v-if="student.github"
              :href="courseReposFor(course, student)"
              target="_blank"
            >
              {{ student.fullName }}
            </a>
            <span v-else>
              {{ student.fullName }}
            </span>
          </td>
          <td
            class="numeric-cell"
            :class="{ 'warning-grade': behindByLessonCount(student) <= lessonWarningThreshold }"
          >
            {{ getCurrentGrade(student) }}
          </td>
          <td
            class="numeric-cell"
            :class="{ 'warning-grade': behindByLessonCount(student) <= lessonWarningThreshold }"
          >
            {{ behindByLessonCount(student) }}
          </td>
          <td class="numeric-cell">
            {{ inProgressLessonCount(student) }}
          </td>
          <td class="numeric-cell">
            {{ maxDaysProjectStaleFor(student) }}
          </td>
          <td class="numeric-cell">
            {{ maxDaysProjectOngoingFor(student) }}
          </td>
          <td class="numeric-cell">
            {{ daysSinceLastProjectActivity(student) }}
          </td>
        </tr>
      </tbody>
    </table>
  </details>
</template>

<script>
import differenceInDays from 'date-fns/difference_in_days'
import { userGetters } from '@state/helpers'
import courseUserGradeCurrentRounded from '@helpers/computed/course-user-grade-current-rounded'
import courseGradeMinExpectedRounded from '@helpers/computed/course-grade-min-expected-rounded'
import courseAverageLessonGradePointsReal from '@helpers/computed/course-average-lesson-grade-points-real'

export default {
  props: {
    course: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      lessonWarningThreshold: -3
    }
  },
  computed: {
    ...userGetters,
    expectedGrade () {
      return courseGradeMinExpectedRounded(this.course)
    },
    isCourseInProgress () {
      const now = Date.now()
      return this.course.startDate <= now && now <= this.course.endDate
    },
    studentsInCourse () {
      return this.course.studentKeys.map(studentKey => {
        return this.users.find(user => user['.key'] === studentKey)
      }).sort((student1, student2) => {
        const student1Progress = this.getCurrentGrade(student1)
        const student2Progress = this.getCurrentGrade(student2)

        // Sort by course progress, then by name
        if (student1Progress === student2Progress) {
          return student1.fullName.toLowerCase() < student2.fullName.toLowerCase() ? -1 : 1
        }
        return student1Progress < student2Progress ? -1 : 1
      })
    }
  },
  methods: {
    getCurrentGrade (student) {
      return courseUserGradeCurrentRounded(this.course, student)
    },
    getMostRecentStudentActivityDate (completion) {
      if (!completion) return 0
      const submission = completion.submission || {}
      return Math.max(
        completion.repositoryCreatedAt || 0,
        completion.firstCommittedAt || 0,
        submission.firstSubmittedAt || 0,
        submission.lastCommentedAt || 0
      )
    },
    behindByLessonCount (student) {
      const currentGrade = this.getCurrentGrade(student)
      return Math.round(
        (currentGrade - this.expectedGrade) /
        courseAverageLessonGradePointsReal(this.course)
      )
    },
    inProgressLessonCount (student) {
      return this.course.projectCompletions.filter(completion => {
        return (
          completion.students[0]['.key'] === student['.key'] &&
          (
            !completion.submission ||
            !completion.submission.isApproved
          )
        )
      }).length
    },
    maxDaysProjectStaleFor (student) {
      const result = this.course.projectCompletions.filter(completion => {
        return (
          completion.students[0]['.key'] === student['.key'] &&
          completion.submission &&
          (
            !completion.submission.isApproved &&
            completion.submission.instructorCommentedLast
          )
        )
      }).map(completion => {
        if (!completion.submission.lastCommentedAt) return -1
        return differenceInDays(Date.now(), completion.submission.lastCommentedAt)
      }).reduce((a, b) => Math.max(a, b), -1)
      return result !== -1 ? result : '--'
    },
    maxDaysProjectOngoingFor (student) {
      const result = this.course.projectCompletions.filter(completion => {
        return (
          completion.students[0]['.key'] === student['.key'] &&
          completion.submission &&
          !completion.submission.isApproved
        )
      }).map(completion => {
        if (!completion.submission.firstSubmittedAt) return -1
        return differenceInDays(Date.now(), completion.submission.firstSubmittedAt)
      }).reduce((a, b) => Math.max(a, b), -1)
      return result !== -1 ? result : '--'
    },
    daysSinceLastProjectActivity (student) {
      const result = this.course.projectCompletions.filter(completion => {
        return (
          completion.students[0]['.key'] === student['.key'] &&
          completion.submission
        )
      }).map(completion => {
        const activityDate = this.getMostRecentStudentActivityDate(completion)
        if (!activityDate) return 999
        return differenceInDays(Date.now(), activityDate) - 1
      }).reduce((a, b) => Math.min(a, b), 999)
      return result !== 999 ? result : '😵'
    },
    courseReposFor (course, student) {
      return [
        'https://github.com/',
        student.github.login,
        '?utf8=✓&tab=repositories&type=source'
        // NOTE: Not including course key for now, because
        // providing a query makes the results sort by
        // repository creation, ascending, which is Not
        // very useful. 😕
      ].join('')
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../meta'

.warning-grade
  color: $design.branding.danger.light
</style>
