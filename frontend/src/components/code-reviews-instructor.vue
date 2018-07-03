<template>
  <section>
    <h2>{{ instructor.fullName }}</h2>
    <table class="dashboard-info">
      <thead>
        <th
          id="grade-point-heading"
          class="numeric-cell sortable"
          title="The current grade points achieved by the student. Click the heading to sort by this value."
          @click="toggleOrderBy('grade-point')"
          @mouseover="showAllSensitiveData = true"
          @mouseout="showAllSensitiveData = false"
        >
          GP
          <OrderByIndicator
            column="grade-point"
            :orderByColumn="orderByColumn"
            :orderByDirection="orderByDirection"
          />
        </th>
        <th
          id="student-heading"
          class="sortable"
          title="The name of the student. Click the heading to sort by this value."
          @click="toggleOrderBy('student')"
        >
          Student
          <OrderByIndicator
            column="student"
            :orderByColumn="orderByColumn"
            :orderByDirection="orderByDirection"
          />
        </th>
        <th
          id="course-heading"
          class="sortable"
          title="The course and section the student is enrolled in. Click the heading to sort by this value."
          @click="toggleOrderBy('course')"
        >
          Course
          <OrderByIndicator
            column="course"
            :orderByColumn="orderByColumn"
            :orderByDirection="orderByDirection"
          />
        </th>
        <th
          id="lesson-heading"
          class="sortable"
          title="The lesson that the project demonstrates. Click the heading to sort by this value."
          @click="toggleOrderBy('lesson')"
        >
          Lesson
          <OrderByIndicator
            column="lesson"
            :orderByColumn="orderByColumn"
            :orderByDirection="orderByDirection"
          />
        </th>
        <th
          id="project-age-heading"
          class="numeric-cell sortable"
          title="The number of days since the project was first submitted. Click the heading to sort by this value."
          @click="toggleOrderBy('project-age')"
        >
          Project Age
          <OrderByIndicator
            column="project-age"
            :orderByColumn="orderByColumn"
            :orderByDirection="orderByDirection"
          />
        </th>
        <th
          id="last-updated-heading"
          class="numeric-cell sortable"
          title="The date on which the project was last updated. Click the heading to sort by this value."
          @click="toggleOrderBy('last-updated')"
        >
          Updated
          <OrderByIndicator
            column="last-updated"
            :orderByColumn="orderByColumn"
            :orderByDirection="orderByDirection"
          />
        </th>
        <th id="links-heading">Links</th>
      </thead>
      <tbody>
        <tr
          v-for="(codeReview, index) in sortCodeReviews(codeReviews)"
          :key="index"
        >
          <td class="numeric-cell">
            <span :class="{ 'review-info-sensitive-data': !showAllSensitiveData }">
              {{ codeReview.studentGradePoints }}
            </span>
          </td>
          <td>
            {{ codeReview.student.fullName }}
            </td>
          <td class="review-info-key">
            {{ humanizeCourseKey(codeReview.course['.key']) }}
          </td>
          <td class="review-info-key">
            <a target="_blank" :href="getCourseLessonUrl(codeReview)">{{ codeReview.lesson['.key'] }}</a>
          </td>
          <td class="numeric-cell">
            {{ getProjectCompletionAgeInDays(codeReview) }}
          </td>
          <td class="numeric-cell">
            {{ getProjectCompletionLastUpdatedDateFormatted(codeReview) }}
          </td>
          <td class="code-review-links">
            <a :href="getFirstIssueUrl(codeReview)" target="_blank" class="icon-link" alt="Open the GitHub issue in a new tab" aria-label="GitHub Issue">
              <span class="fas fa-exclamation-circle" aria-hidden="true" title="Open this issue on GitHub"></span>
            </a>
            <a :href="getGitHubProjectUrl(codeReview)" target="_blank" class="icon-link" alt="Open the GitHub code in a new tab" aria-label="GitHub Code">
              <span class="fas fa-code" aria-hidden="true" title="View the code on GitHub"></span>
            </a>
            <a :href="getHostedUrl(codeReview)" target="_blank" class="icon-link" alt="Open the hosted site in a new tab" aria-label="Hosted Site">
              <span class="fas fa-globe-americas" aria-hidden="true" title="View the hosted site"></span>
            </a>
            <a :href="getValidatorUrl(codeReview)" target="_blank" class="icon-link" alt="Open validator errors in a new tab" aria-label="W3 Validator">
              <span class="fas fa-check-circle" aria-hidden="true" title="View the W3 validator"></span>
            </a>
            <a @click="openAllLinks(codeReview)" target="_blank" class="icon-link" alt="Open all links in a new tab" aria-label="All links">
              <span class="fas fa-folder-open" aria-hidden="true" title="Open all links"></span>
            </a>
          </td>
          <td class="review-reassignment-control">
            <select
              v-model="codeReview.projectCompletion.submission.assignedInstructor"
              aria-label="Reassign this review"
            >
              <option
                v-for="instructorKey in codeReview.course.instructorKeys"
                :key="instructorKey"
                :value="instructorKey"
              >
                {{ getInstructorInitialsFromKey(instructorKey) }}
              </option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
import OrderByIndicator from '@components/indicator-order-by'
import { userGetters, lessonGetters } from '@state/helpers'
import courseProjectCompletionRepoName from '@helpers/computed/course-project-completion-repo-name'
import courseProjectCompletionHostedUrl from '@helpers/computed/course-project-completion-hosted-url'
import orderBy from 'lodash/orderBy'
import differenceInDays from 'date-fns/difference_in_days'
import formatDate from 'date-fns/format'
import mostRecentDate from 'date-fns/max'

export default {
  components: { OrderByIndicator },
  props: {
    instructor: {
      type: Object,
      required: true
    },
    codeReviews: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      showAllSensitiveData: false,
      orderByColumn: 'grade-point',
      orderByDirection: 'asc',
      orderByIdentifier: {
        'grade-point': codeReview => codeReview.studentGradePoints,
        'student': codeReview => codeReview.student.fullName,
        'course': codeReview => codeReview.course['.key'],
        'lesson': codeReview => codeReview.lesson['.key'],
        'project-age': this.getProjectCompletionAgeInDays,
        'last-updated': this.getProjectCompletionLastUpdatedDate
      }
    }
  },
  methods: {
    getUser (userKey) {
      return this.users.find(user => user['.key'] === userKey)
    },
    getFirstIssueUrl (codeReview) {
      return this.getGitHubProjectUrl(codeReview) + '/issues/1'
    },
    getGitHubProjectUrl (codeReview) {
      return [
        'https://github.com/',
        codeReview.student.github.login,
        '/',
        this.getRepoName(codeReview)
      ].join('')
    },
    getCourseLessonUrl (codeReview) {
      return [
        '/courses/',
        codeReview.course['.key'],
        '/lessons/',
        codeReview.lesson['.key']
      ].join('')
    },
    getHostedUrl (codeReview) {
      return courseProjectCompletionHostedUrl(
        codeReview.course,
        codeReview.projectCompletion,
      )
    },
    getValidatorUrl (codeReview) {
      return [
        'https://validator.w3.org/nu/?doc=',
        this.getHostedUrl(codeReview)
      ].join('')
    },
    openAllLinks (codeReview) {
      window.open(this.getFirstIssueUrl(codeReview))
      window.open(this.getGitHubProjectUrl(codeReview))
      window.open(this.getHostedUrl(codeReview))
      window.open(this.getValidatorUrl(codeReview))
    },
    getRepoName (codeReview) {
      return courseProjectCompletionRepoName(
        codeReview.course,
        codeReview.projectCompletion
      )
    },
    humanizeCourseKey (key) {
      const keyParts = key.split('-')
      return keyParts[0] + keyParts[1] + ' (' + keyParts[3] + ')'
    },
    getInstructorInitialsFromKey (intructorKey) {
      const instructor = this.getUser(intructorKey)
      return instructor.fullName.replace(/[^A-Z]/g, '')
    },
    getProjectCompletionAgeInDays (codeReview) {
      return differenceInDays(Date.now(), codeReview.projectCompletion.submission.firstSubmittedAt) + 1
    },
    getProjectCompletionLastUpdatedDate (codeReview) {
      const projectSubmission = codeReview.projectCompletion.submission
      return mostRecentDate(
        projectSubmission.approvedAt || 0,
        projectSubmission.firstSubmittedAt || 0,
        projectSubmission.lastCommentedAt || 0,
        codeReview.projectCompletion.repositoryCreatedAt || 0,
        codeReview.projectCompletion.firstCommittedAt || 0
      )
    },
    getProjectCompletionLastUpdatedDateFormatted (codeReview) {
      return formatDate(this.getProjectCompletionLastUpdatedDate(codeReview), 'MMM D')
    },
    sortCodeReviews (codeReviews) {
      return orderBy(codeReviews, [
        this.orderByIdentifier[this.orderByColumn],
        codeReview => codeReview.student['.key']
      ], [this.orderByDirection, this.orderByDirection])
    },
    toggleOrderBy (column) {
      if (this.orderByColumn === column) {
        this.orderByDirection = this.orderByDirection === 'asc' ? 'desc' : 'asc'
      } else {
        this.orderByColumn = column
        this.orderByDirection = 'asc'
      }
    }
  },
  computed: {
    ...userGetters,
    ...lessonGetters
  }
}
</script>


<style lang="stylus" scoped>
@import '../meta'

td
  white-space: nowrap

td .review-info-sensitive-data
  filter: blur(7px)
  transition: filter .3s

td:hover .review-info-sensitive-data
  filter: none

#grade-point-heading
  width: 5%

#student-heading
  width: 25%

#course-heading
  width: 10%

#lesson-heading
  width: 30%

#project-age-heading
  width: 10%

#last-updated-heading
  width: 10%

#links-heading
  width: 10%

.code-review-links
  text-align: center

.fa
  font-size: 1.4em

.icon-link:not(:last-child)
  margin-right: .2em

.review-info-key
  white-space: nowrap

.review-reassignment-control
  width: 1px
  background-color: transparent
  border: none
  padding-top: 0
  padding-right: 0
  padding-bottom: 0

.sortable
  cursor: pointer
</style>
