<template>
  <details v-if="studentsInCourse.length">
    <summary>{{ course['.key'] }}</summary>
    <table class="dashboard-info">
      <colgroup span="2"></colgroup>
      <colgroup span="3"></colgroup>
      <colgroup span="4"></colgroup>
      <thead>
        <tr>
          <th colspan="2" scope="colgroup">Student</th>
          <th colspan="3" scope="colgroup">Grade</th>
          <th colspan="4" scope="colgroup">Projects</th>
        </tr>
        <tr>
          <!-- STUDENT -->
          <th scope="col">
            Links
          </th>
          <th scope="col">
            Name
          </th>
          <!-- GRADE -->
          <th class="numeric-cell" scope="col">
            Current
          </th>
          <th class="numeric-cell" scope="col">
            Delta
          </th>
          <th class="numeric-cell" scope="col" title="Student's final grade (unrounded) if they continue at this pace">
            Projected
          </th>
          <!-- PROJECTS -->
          <th class="numeric-cell" scope="col" title="Number of days since an update was made to a project">
            Days Inactive
          </th>
          <th class="numeric-cell" scope="col" title="Total projects a student has submitted that have not yet been approved">
            Total Open
          </th>
          <th class="numeric-cell" scope="col" title="Maximum number of days a submitted project has gone unapproved">
            Days Open
          </th>
          <th class="numeric-cell" scope="col" title="Maximum number of days since a project has had changes requested">
            Days Stale
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in studentsInCourse" :key="student.userId">

          <!-- STUDENT: Links -->
          <td class="links">
            <a
              v-if="student.github"
              :href="courseReposFor(course, student)"
              target="_blank"
              class="icon-link"
              alt="Open Github profile in new tab"
              aria-label="GitHub Profile"
            >
              <span class="fab fa-github" aria-hidden="true" title="Open student's GitHub profile"></span>
            </a>

            <a
              v-if="student.email"
              :href="'mailto:' + student.email"
              target="_blank"
              class="icon-link"
              alt="Email student"
              aria-label="Email address"
            >
              <span class="far fa-envelope" aria-hidden="true" title="Email student"></span>
            </a>
          </td>

          <!-- STUDENT: Name -->
          <td scope="row" class="align-right">
            {{ student.fullName }}
          </td>

          <!-- GRADE: Current grade -->
          <td
            class="numeric-cell"
            :class="getCurrentGradeStyle(student)"
          >
            {{ getCurrentGrade(student) }}
          </td>
          <!-- GRADE: Delta -->
          <td
            class="numeric-cell"
            :class="getCurrentGradeStyle(student)"
          >
            ({{ getCurrentGradeDelta(student) }})
          </td>
          <!-- GRADE: Projected Grade -->
          <td
            class="numeric-cell"
            :class="getCurrentGradeStyle(student)"
          >
            {{ getProjectedGrade(student) }}
          </td>

          <!-- PROJECTS: Days Inactive -->
          <td
            class="numeric-cell"
            :class="getDaysInactiveStyle(student)"
          >
            {{ daysSinceLastProjectActivity(student) }}
          </td>
          <!-- PROJECTS: Total Open -->
          <td class="numeric-cell" :title="isNaN(inProgressLessonCount(student)) ? 'This student has no submitted, unapproved projects' : ''">
            {{ inProgressLessonCount(student) }}
          </td>
          <!-- PROJECTS: Days Open -->
          <td class="numeric-cell" :title="isNaN(maxDaysProjectOngoingFor(student)) ? 'This student has no submitted, unapproved projects' : ''">
            {{ maxDaysProjectOngoingFor(student) }}
          </td>
          <!-- PROJECTS: Days Stale -->
          <td class="numeric-cell" :title="isNaN(maxDaysProjectStaleFor(student)) ? 'This student has no submitted, unapproved projects where the instructor was last to comment' : ''">
            {{ maxDaysProjectStaleFor(student) }}
          </td>
        </tr>
      </tbody>
    </table>
  </details>
</template>

<script>
import store from '@state/store'
import differenceInDays from 'date-fns/difference_in_days'
import { userGetters } from '@state/helpers'
import courseUserGradeCurrentRounded from '@helpers/computed/course-user-grade-current-rounded'
import courseGradeMinExpectedRounded from '@helpers/computed/course-grade-min-expected-rounded'
import courseUserGradeProjectedReal from '@helpers/computed/course-user-grade-projected-real'
import courseAverageLessonGradePointsReal from '@helpers/computed/course-average-lesson-grade-points-real'
import gradeMax from '@constants/grade-max'
import normalizedSemesterWeeks from '@constants/normalized-semester-weeks'

export default {
  props: {
    course: {
      type: Object,
      required: true
    }
  },
  created () {
    store.dispatch('syncLargeFieldsOfResource', {
      resourceName: 'courses',
      resourceKey: this.course['.key']
    })
  },
  computed: {
    ...userGetters,
    expectedGrade () {
      return courseGradeMinExpectedRounded(this.course)
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
    formatGrade (grade) {
      return grade !== 0 ? parseFloat(grade).toFixed(2) : 0
    },
    getCurrentGrade (student) {
      const roundedGrade = courseUserGradeCurrentRounded(this.course, student)
      return this.formatGrade(roundedGrade)
    },
    getCurrentGradeDelta (student) {
      const currentGrade = courseUserGradeCurrentRounded(this.course, student)
      const deltaGrade = currentGrade - this.expectedGrade
      return (deltaGrade >= 0 ? '+' : '') + this.formatGrade(deltaGrade)
    },
    getCurrentGradeStyle (student) {
      const currentGrade = courseUserGradeCurrentRounded(this.course, student)
      const deltaGrade = currentGrade - this.expectedGrade
      // Threshold is the expected grade after one week of lesson work
      const gradeThreshold = gradeMax / normalizedSemesterWeeks

      if (deltaGrade >= gradeThreshold) {
        return 'allstar-grade'
      } else if (deltaGrade <= -gradeThreshold) {
        return 'warning-grade'
      } else {
        return ''
      }
    },
    getProjectedGrade (student) {
      const projectedGrade = courseUserGradeProjectedReal(this.course, student)
      return this.formatGrade(projectedGrade)
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
        return differenceInDays(Date.now(), activityDate)
      }).reduce((a, b) => Math.min(a, b), 999)
      return result !== 999 ? result : '😵'
    },
    getDaysInactiveStyle (student) {
      const daysInactive = this.daysSinceLastProjectActivity(student)
      if (daysInactive >= 5) {
        return 'warning-inactive'
      } else {
        return ''
      }
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

.warning-grade, .warning-inactive
  color: $design.branding.danger.dark
.allstar-grade
  color: $design.branding.success.light

.grade-delta
  width: 1px
  white-space: nowrap
  border-left-style: dashed

table
  border-collapse: collapse

colgroup, thead
  border: 2px solid #ddd

.align-right
  text-align: right

.links
  text-align: center

.fa
  font-size: 1.4em

.icon-link:not(:last-child)
  margin-right: .2em

details:last-child
  margin-bottom: 3em
</style>
