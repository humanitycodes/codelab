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
          Expected: {{ expectedGradePoints }}
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
            {{ achievedGradePoints(student) }}
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
        </tr>
      </tbody>
    </table>
  </details>
</template>

<script>
import differenceInDays from 'date-fns/difference_in_days'
import { userGetters } from '@state/helpers'
import achievedGradePoints from '@helpers/achieved-grade-points'
import minGradeExpectation from '@helpers/min-grade-expectation'
import averageLessonGradePoints from '@helpers/average-lesson-grade-points'

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
    expectedGradePoints () {
      return Number(minGradeExpectation(this.course)).toFixed(2)
    },
    isCourseInProgress () {
      const now = Date.now()
      return this.course.startDate <= now && now <= this.course.endDate
    },
    studentsInCourse () {
      return this.course.studentKeys.map(studentKey => {
        return this.users.find(user => user['.key'] === studentKey)
      }).sort((student1, student2) => {
        const student1Progress = this.achievedGradePoints(student1)
        const student2Progress = this.achievedGradePoints(student2)

        // Sort by course progress, then by name
        if (student1Progress === student2Progress) {
          return student1.fullName.toLowerCase() < student2.fullName.toLowerCase() ? -1 : 1
        }
        return student1Progress < student2Progress ? -1 : 1
      })
    }
  },
  methods: {
    achievedGradePoints (student) {
      const gpa = achievedGradePoints(student, this.course)
      return Number(gpa).toFixed(2)
    },
    behindByLessonCount (student) {
      const achievedGradePoints = this.achievedGradePoints(student)
      return Math.round((achievedGradePoints - this.expectedGradePoints) / averageLessonGradePoints(this.course))
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
      return this.course.projectCompletions.filter(completion => {
        return (
          completion.students[0]['.key'] === student['.key'] &&
          completion.submission &&
          (
            !completion.submission.isApproved &&
            completion.submission.instructorCommentedLast
          )
        )
      }).map(completion => {
        if (!completion.submission.lastCommentedAt) return 0
        return differenceInDays(Date.now(), completion.submission.lastCommentedAt)
      }).reduce((a, b) => Math.max(a, b), 0)
    },
    maxDaysProjectOngoingFor (student) {
      return this.course.projectCompletions.filter(completion => {
        return (
          completion.students[0]['.key'] === student['.key'] &&
          completion.submission &&
          !completion.submission.isApproved
        )
      }).map(completion => {
        if (!completion.submission.firstSubmittedAt) return 0
        return differenceInDays(Date.now(), completion.submission.firstSubmittedAt)
      }).reduce((a, b) => Math.max(a, b), 0)
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
