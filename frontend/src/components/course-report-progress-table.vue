<template>
  <table class="dashboard-info" role="grid" :aria-rowcount="rows.length">
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
        <th scope="col" :aria-sort="ariaSortDirection('name')">
          <a href="javascript:void(0)" @click="toggleOrderBy('name')">
            Name
            <OrderByIndicator
              column="name"
              :orderByColumn="orderByColumn"
              :orderByDirection="orderByDirection"
            />
          </a>
        </th>
        <!-- GRADE -->
        <th
          scope="col"
          class="numeric-cell"
          :aria-sort="ariaSortDirection('current-grade')"
        >
          <a href="javascript:void(0)" @click="toggleOrderBy('current-grade')">
            Current
            <OrderByIndicator
              column="current-grade"
              :orderByColumn="orderByColumn"
              :orderByDirection="orderByDirection"
            />
          </a>
        </th>
        <th
          scope="col"
          class="numeric-cell"
          :aria-sort="ariaSortDirection('delta-grade')"
        >
          <a href="javascript:void(0)" @click="toggleOrderBy('delta-grade')">
            Delta
            <OrderByIndicator
              column="delta-grade"
              :orderByColumn="orderByColumn"
              :orderByDirection="orderByDirection"
            />
          </a>
        </th>
        <th
          scope="col"
          class="numeric-cell"
          :aria-sort="ariaSortDirection('projected-grade')"
        >
          <a
            href="javascript:void(0)"
            title="Student's final grade (unrounded) if they continue at this pace"
            @click="toggleOrderBy('projected-grade')"
          >
            Projected
            <OrderByIndicator
              column="projected-grade"
              :orderByColumn="orderByColumn"
              :orderByDirection="orderByDirection"
            />
          </a>
        </th>
        <!-- PROJECTS -->
        <th
          scope="col"
          class="numeric-cell"
          :aria-sort="ariaSortDirection('days-inactive')"
        >
          <a
            href="javascript:void(0)"
            title="Number of days since an update was made to a project"
            @click="toggleOrderBy('days-inactive')"
          >
            Days Inactive
            <OrderByIndicator
              column="days-inactive"
              :orderByColumn="orderByColumn"
              :orderByDirection="orderByDirection"
            />
          </a>
        </th>
        <th
          scope="col"
          class="numeric-cell"
          :aria-sort="ariaSortDirection('open-projects')"
        >
          <a
            href="javascript:void(0)"
            title="Total projects a student has submitted that have not yet been approved"
            @click="toggleOrderBy('open-projects')"
          >
            Total Open
            <OrderByIndicator
              column="open-projects"
              :orderByColumn="orderByColumn"
              :orderByDirection="orderByDirection"
            />
          </a>
        </th>
        <th
          scope="col"
          class="numeric-cell"
          :aria-sort="ariaSortDirection('days-open')"
        >
          <a
            href="javascript:void(0)"
            title="Maximum number of days a submitted project has gone unapproved"
            @click="toggleOrderBy('days-open')"
          >
            Days Open
            <OrderByIndicator
              column="days-open"
              :orderByColumn="orderByColumn"
              :orderByDirection="orderByDirection"
            />
          </a>
        </th>
        <th
          scope="col"
          class="numeric-cell"
          :aria-sort="ariaSortDirection('days-stale')"
        >
          <a
            href="javascript:void(0)"
            title="Maximum number of days since a project has had changes requested"
            @click="toggleOrderBy('days-stale')"
          >
            Days Stale
            <OrderByIndicator
              column="days-stale"
              :orderByColumn="orderByColumn"
              :orderByDirection="orderByDirection"
            />
          </a>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(row, index) in rows"
        :key="index"
        :aria-rowindex="index + 1"
      >
        <!-- STUDENT: Links -->
        <td class="text-center">
          <a
            v-if="row.student.githubLogin"
            :href="courseReposFor(row.student)"
            target="_blank"
            class="icon-link"
            alt="Open Github profile in new tab"
            aria-label="GitHub Profile"
          >
            <span
              class="fab fa-github"
              aria-hidden="true"
              title="Open student's GitHub profile"
            ></span>
          </a>
          <a
            v-if="row.student.email"
            :href="'mailto:' + row.student.email"
            target="_blank"
            class="icon-link"
            alt="Email student"
            aria-label="Email address"
          >
            <span
              class="far fa-envelope"
              aria-hidden="true"
              title="Email student"
            ></span>
          </a>
        </td>

        <!-- STUDENT: Name -->
        <td scope="row" class="text-right">
          {{ row.student.fullName }}
        </td>

        <!-- GRADE: Current grade -->
        <td
          class="numeric-cell"
          :class="gradeStyle(row.deltaGrade)"
        >
          {{ row.currentGrade }}
        </td>
        <!-- GRADE: Delta -->
        <td
          class="numeric-cell"
          :class="gradeStyle(row.deltaGrade)"
        >
          ({{ row.deltaGrade }})
        </td>
        <!-- GRADE: Projected Grade -->
        <td
          class="numeric-cell"
          :class="gradeStyle(row.deltaGrade)"
        >
          {{ row.projectedGrade }}
        </td>

        <!-- PROJECTS: Days Inactive -->
        <td
          class="numeric-cell"
          :class="daysInactiveStyle(row.daysInactive)"
        >
          {{ row.daysInactive }}
        </td>
        <!-- PROJECTS: Total Open -->
        <td
          class="numeric-cell"
          :title="isNaN(row.openProjects) ? 'This student has no submitted, unapproved projects' : ''"
        >
          {{ row.openProjects }}
        </td>
        <!-- PROJECTS: Days Open -->
        <td
          class="numeric-cell"
          :title="isNaN(row.daysOpen) ? 'This student has no submitted, unapproved projects' : ''"
        >
          {{ row.daysOpen }}
        </td>
        <!-- PROJECTS: Days Stale -->
        <td
          class="numeric-cell"
          :title="isNaN(row.daysStale) ? 'This student has no submitted, unapproved projects where the instructor was last to comment' : ''"
        >
          {{ row.daysStale }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import OrderByIndicator from '@components/indicator-order-by'
import daysSince from '@helpers/computed/days-since'
import { userGetters, projectCompletionGetters } from '@state/helpers'
import courseUserGradeCurrentReal from '@helpers/computed/course-user-grade-current-real'
import courseGradeMinExpectedRounded from '@helpers/computed/course-grade-min-expected-rounded'
import courseUserGradeProjectedReal from '@helpers/computed/course-user-grade-projected-real'
import getGradeRounded from '@helpers/utils/get-grade-rounded'
import gradeMax from '@constants/grade-max'
import normalizedSemesterWeeks from '@constants/normalized-semester-weeks'
import orderBy from 'lodash/orderBy'

// Threshold is the expected grade after one week of lesson work
const gradeThreshold = gradeMax / normalizedSemesterWeeks

export default {
  components: {
    OrderByIndicator
  },
  props: {
    course: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      expectedGrade: courseGradeMinExpectedRounded(this.course),
      orderByColumn: 'current-grade',
      orderByDirection: 'asc',
      orderByIdentifier: {
        'name': row => row.student.fullName,
        'current-grade': row => parseFloat(row.currentGrade),
        'delta-grade': row => parseFloat(row.deltaGrade),
        'projected-grade': row => parseFloat(row.projectedGrade),
        'days-inactive': row => parseInt(row.daysInactive) || Infinity,
        'open-projects': row => parseInt(row.openProjects),
        'days-open': row => parseInt(row.daysOpen) || -1,
        'days-stale': row => parseInt(row.daysStale) || -1
      }
    }
  },
  computed: {
    ...userGetters,
    ...projectCompletionGetters,
    rows () {
      const rows = this.course.studentIds.map(studentId => {
        const student = this.users.find(user => user.userId === studentId)
        const progress = this.progressForStudent(student)
        return {
          student,
          ...progress
        }
      })
      return orderBy(rows, [
        this.orderByIdentifier[this.orderByColumn],
        row => row.student.userId
      ], [this.orderByDirection, this.orderByDirection])
    },
    courseProjectCompletions () {
      return this.projectCompletions.filter(
        completion => completion.courseId === this.course.courseId
      )
    },
    studentProjectCompletions () {
      const completions = {}
      this.course.studentIds.forEach(studentId => {
        completions[studentId] = this.courseProjectCompletions.filter(
          completion => completion.studentUserId === studentId
        )
      })
      return completions
    }
  },
  methods: {
    ariaSortDirection (column) {
      if (this.orderByColumn !== column) return 'none'
      return this.orderByDirection === 'asc' ? 'ascending' : 'descending'
    },
    toggleOrderBy (column) {
      if (this.orderByColumn === column) {
        this.orderByDirection = this.orderByDirection === 'asc' ? 'desc' : 'asc'
      } else {
        this.orderByColumn = column
        this.orderByDirection = 'asc'
      }
    },
    progressForStudent (student) {
      const realGrade = courseUserGradeCurrentReal(this.course, student)
      const roundedGrade = getGradeRounded(realGrade)
      const currentGrade = this.getCurrentGrade(roundedGrade)
      const deltaGrade = this.getCurrentGradeDelta(roundedGrade)
      const projectedGrade = this.getProjectedGrade(realGrade)
      const daysInactive = this.daysSinceLastProjectActivity(student)
      const openProjects = this.inProgressLessonCount(student)
      const daysOpen = this.maxDaysProjectOngoingFor(student)
      const daysStale = this.maxDaysProjectStaleFor(student)
      return {
        currentGrade,
        deltaGrade,
        projectedGrade,
        daysInactive,
        openProjects,
        daysOpen,
        daysStale
      }
    },
    formatGrade (grade) {
      return grade !== 0 ? parseFloat(grade).toFixed(2) : 0
    },
    getCurrentGrade (roundedGrade) {
      return this.formatGrade(roundedGrade)
    },
    getCurrentGradeDelta (roundedGrade) {
      const deltaGrade = roundedGrade - this.expectedGrade
      return (deltaGrade >= 0 ? '+' : '') + this.formatGrade(deltaGrade)
    },
    gradeStyle (deltaGrade) {
      if (deltaGrade >= gradeThreshold) {
        return 'allstar-grade'
      } else if (deltaGrade <= -gradeThreshold) {
        return 'warning-grade'
      } else {
        return ''
      }
    },
    getProjectedGrade (realGrade) {
      const projectedGrade = courseUserGradeProjectedReal(this.course, realGrade)
      return this.formatGrade(projectedGrade)
    },
    getMostRecentStudentActivityDate (completion) {
      if (!completion) return 0
      return Math.max(
        completion.repositoryCreatedAt || 0,
        completion.firstCommittedAt || 0,
        completion.firstSubmittedAt || 0,
        completion.lastCommentedAt || 0
      )
    },
    inProgressLessonCount (student) {
      const studentCompletions = this.studentProjectCompletions[student.userId]
      return studentCompletions.filter(
        completion => !completion.approved
      ).length
    },
    maxDaysProjectStaleFor (student) {
      const studentCompletions = this.studentProjectCompletions[student.userId]
      const result = studentCompletions.filter(
        completion => !completion.approved && completion.instructorCommentedLast
      ).map(completion => completion.lastCommentedAt
        ? daysSince(completion.lastCommentedAt)
        : -1
      ).reduce((a, b) => Math.max(a, b), -1)
      return result !== -1 ? result : '--'
    },
    maxDaysProjectOngoingFor (student) {
      const studentCompletions = this.studentProjectCompletions[student.userId]
      const result = studentCompletions.filter(
        completion => !completion.approved
      ).map(completion => completion.firstSubmittedAt
        ? daysSince(completion.firstSubmittedAt)
        : -1
      ).reduce((a, b) => Math.max(a, b), -1)
      return result !== -1 ? result : '--'
    },
    daysSinceLastProjectActivity (student) {
      const studentCompletions = this.studentProjectCompletions[student.userId]
      const result = studentCompletions.filter(
        completion => completion.firstSubmittedAt
      ).map(completion =>
        daysSince(this.getMostRecentStudentActivityDate(completion))
      ).reduce((a, b) => Math.min(a, b), Infinity)
      return result !== Infinity ? result : '😵'
    },
    daysInactiveStyle (daysInactive) {
      return daysInactive >= 5 ? 'warning-inactive' : ''
    },
    courseReposFor (student) {
      return [
        'https://github.com/',
        student.githubLogin,
        '?utf8=✓&tab=repositories&type=source'
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

.icon-link
  margin-right: .2em

table
  border-collapse: collapse
  colgroup, thead
    border: 2px solid #ddd
</style>
