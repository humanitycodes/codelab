<template>
  <section>
    <h2>{{ instructor.fullName }}</h2>
    <table
      role="grid"
      class="dashboard-info"
      :aria-rowcount="codeReviews.length"
    >
      <thead>
        <th
          class="grade-point-heading"
          :aria-sort="ariaSortDirection('grade-point')"
          @mouseover="showAllSensitiveData = true"
          @mouseout="showAllSensitiveData = false"
        >
          <a
            href="javascript:void(0)"
            title="The current grade points achieved by the student."
            @click="toggleOrderBy('grade-point')"
            @focus="showAllSensitiveData = true"
            @blur="showAllSensitiveData = false"
          >
            GP
            <OrderByIndicator
              column="grade-point"
              :orderByColumn="orderByColumn"
              :orderByDirection="orderByDirection"
            />
          </a>
        </th>
        <th
          class="student-heading"
          :aria-sort="ariaSortDirection('student')"
        >
          <a
            href="javascript:void(0)"
            title="The name of the student."
            @click="toggleOrderBy('student')"
          >
            Student
            <OrderByIndicator
              column="student"
              :orderByColumn="orderByColumn"
              :orderByDirection="orderByDirection"
            />
          </a>
        </th>
        <th
          class="course-heading"
          :aria-sort="ariaSortDirection('course')"
        >
          <a
            href="javascript:void(0)"
            title="The course and section the student is enrolled in."
            @click="toggleOrderBy('course')"
          >
            Course
            <OrderByIndicator
              column="course"
              :orderByColumn="orderByColumn"
              :orderByDirection="orderByDirection"
            />
          </a>
        </th>
        <th
          class="lesson-heading"
          :aria-sort="ariaSortDirection('lesson')"
        >
          <a
            href="javascript:void(0)"
            title="The lesson that the project demonstrates."
            @click="toggleOrderBy('lesson')"
          >
            Lesson
            <OrderByIndicator
              column="lesson"
              :orderByColumn="orderByColumn"
              :orderByDirection="orderByDirection"
            />
          </a>
        </th>
        <th
          class="project-age-heading"
          :aria-sort="ariaSortDirection('project-age')"
        >
          <a
            href="javascript:void(0)"
            title="The number of days since the project was first submitted."
            @click="toggleOrderBy('project-age')"
          >
            Age
            <OrderByIndicator
              column="project-age"
              :orderByColumn="orderByColumn"
              :orderByDirection="orderByDirection"
            />
          </a>
        </th>
        <th
          class="last-updated-heading numeric-cell"
          :aria-sort="ariaSortDirection('last-updated')"
        >
          <a
            href="javascript:void(0)"
            title="The date on which the project was last updated."
            @click="toggleOrderBy('last-updated')"
          >
            Updated
            <OrderByIndicator
              column="last-updated"
              :orderByColumn="orderByColumn"
              :orderByDirection="orderByDirection"
            />
          </a>
        </th>
        <th class="links-heading">Links</th>
      </thead>
      <tbody>
        <tr
          v-for="(codeReview, index) in sortCodeReviews(codeReviews)"
          :key="index"
          :aria-rowindex="index + 1"
        >
          <td class="numeric-cell">
            <span
              :class="{ 'review-info-sensitive-data': !showAllSensitiveData }"
            >
              {{ codeReview.studentGradePoints }}
            </span>
          </td>
          <td>
            {{ codeReview.student.fullName }}
          </td>
          <td class="review-info-key">
            {{ humanizeCourseKey(codeReview.course.courseKey) }}
          </td>
          <td class="review-info-key">
            <a
              target="_blank"
              :href="getCourseLessonUrl(codeReview)"
            >{{ codeReview.lesson.lessonKey }}</a>
          </td>
          <td class="numeric-cell">
            {{ getProjectCompletionAgeInDays(codeReview) }}
          </td>
          <td class="numeric-cell">
            {{ getProjectCompletionLastUpdatedDateFormatted(codeReview) }}
          </td>
          <td class="code-review-links">
            <a
              target="_blank"
              class="icon-link"
              alt="Open the GitHub issue in a new tab"
              aria-label="GitHub Issue"
              :href="getFirstIssueUrl(codeReview)"
            >
              <span
                class="fas fa-exclamation-circle"
                aria-hidden="true"
                title="Open this issue on GitHub"
              ></span>
            </a>
            <a
              target="_blank"
              class="icon-link"
              alt="Open the GitHub code in a new tab"
              aria-label="GitHub Code"
              :href="getGitHubProjectUrl(codeReview)"
            >
              <span
                class="fas fa-code"
                aria-hidden="true"
                title="View the code on GitHub"
              ></span>
            </a>
            <a
              target="_blank"
              class="icon-link"
              alt="Open the hosted site in a new tab"
              aria-label="Hosted Site"
              :href="getHostedUrl(codeReview)"
            >
              <span
                class="fas fa-globe-americas"
                aria-hidden="true"
                title="View the hosted site"
              ></span>
            </a>
            <a
              target="_blank"
              class="icon-link"
              alt="Open validator errors in a new tab"
              aria-label="W3 Validator"
              :href="getValidatorUrl(codeReview)"
            >
              <span
                class="fas fa-check-circle"
                aria-hidden="true"
                title="View the W3 validator"
              ></span>
            </a>
            <a
              target="_blank"
              class="icon-link"
              alt="Open all links in a new tab"
              aria-label="All links"
              @click="openAllLinks(codeReview)"
            >
              <span
                class="fas fa-folder-open"
                aria-hidden="true"
                title="Open all links"
              ></span>
            </a>
          </td>
          <td class="review-reassignment-control">
            <select
              aria-label="Reassign this review"
              @change="reassignInstructor(codeReview.projectCompletion, $event)"
              :value="codeReview.projectCompletion.instructorUserId"
              :ref="reassignmentRef(codeReview.projectCompletion)"
            >
              <option
                v-for="instructorId in codeReview.course.instructorIds"
                :key="instructorId"
                :value="instructorId"
              >
                {{ getInstructorInitialsFromId(instructorId) }}
              </option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
import store from '@state/store'
import OrderByIndicator from '@components/indicator-order-by'
import courseProjectCompletionRepoName from '@helpers/computed/course-project-completion-repo-name'
import courseProjectCompletionHostedUrl from '@helpers/computed/course-project-completion-hosted-url'
import userById from '@helpers/finders/user-by-id'
import orderBy from 'lodash/orderBy'
import moment from 'moment'
import daysSince from '@helpers/computed/days-since'
import updateProjectCompletionInstructor from '@api/project-completions/update-project-completion-instructor'

export default {
  components: {
    OrderByIndicator
  },
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
        'course': codeReview => codeReview.course.courseKey,
        'lesson': codeReview => codeReview.lesson.lessonKey,
        'project-age': this.getProjectCompletionAgeInDays,
        'last-updated': this.getProjectCompletionLastUpdatedDate
      }
    }
  },
  methods: {
    ariaSortDirection (column) {
      if (this.orderByColumn !== column) return 'none'
      return this.orderByDirection === 'asc' ? 'ascending' : 'descending'
    },
    getFirstIssueUrl (codeReview) {
      return this.getGitHubProjectUrl(codeReview) + '/issues/1'
    },
    getGitHubProjectUrl (codeReview) {
      return [
        'https://github.com/',
        codeReview.student.githubLogin,
        '/',
        this.getRepoName(codeReview)
      ].join('')
    },
    getCourseLessonUrl (codeReview) {
      return [
        '/courses/',
        codeReview.course.courseKey,
        '/lessons/',
        codeReview.lesson.lessonKey
      ].join('')
    },
    getHostedUrl (codeReview) {
      return courseProjectCompletionHostedUrl(
        codeReview.course,
        codeReview.projectCompletion
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
    getInstructorInitialsFromId (instructorId) {
      const instructor = userById(instructorId)
      return instructor.fullName.replace(/[^A-Z]/g, '')
    },
    getProjectCompletionAgeInDays (codeReview) {
      return 1 + daysSince(codeReview.projectCompletion.firstSubmittedAt)
    },
    getProjectCompletionLastUpdatedDate (codeReview) {
      return moment.max([
        codeReview.projectCompletion.approvedAt || 0,
        codeReview.projectCompletion.firstSubmittedAt || 0,
        codeReview.projectCompletion.lastCommentedAt || 0,
        codeReview.projectCompletion.repositoryCreatedAt || 0,
        codeReview.projectCompletion.firstCommittedAt || 0
      ].map(timestamp => moment(timestamp)))
    },
    getProjectCompletionLastUpdatedDateFormatted (codeReview) {
      const lastUpdated = this.getProjectCompletionLastUpdatedDate(codeReview)
      return moment(lastUpdated).format('MMM D')
    },
    sortCodeReviews (codeReviews) {
      return orderBy(codeReviews, [
        this.orderByIdentifier[this.orderByColumn],
        codeReview => codeReview.student.userId
      ], [this.orderByDirection, this.orderByDirection])
    },
    toggleOrderBy (column) {
      if (this.orderByColumn === column) {
        this.orderByDirection = this.orderByDirection === 'asc' ? 'desc' : 'asc'
      } else {
        this.orderByColumn = column
        this.orderByDirection = 'asc'
      }
    },
    reassignmentRef (projectCompletion) {
      return `reviewReassignment${projectCompletion.projectCompletionId}`
    },
    reassignInstructor (projectCompletion, event) {
      const projectCompletionId = projectCompletion.projectCompletionId
      const instructorUserId = event.target.value
      updateProjectCompletionInstructor({
        projectCompletionId, instructorUserId
      })
      .then(() => {
        return store.dispatch('syncProjectCompletion', projectCompletionId)
      })
      .catch(() => {
        const ref = this.$refs[this.reassignmentRef(projectCompletion)][0]
        ref.value = projectCompletion.instructorUserId
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../meta'

td
  white-space: nowrap
  .review-info-sensitive-data
    filter: blur(7px)
    transition: filter .3s
  &:hover .review-info-sensitive-data
    filter: none

.grade-point-heading
  width: 5%

.student-heading
  width: 25%

.course-heading
  width: 10%

.lesson-heading
  width: 30%

.project-age-heading
  width: 10%

.last-updated-heading
  width: 10%

.links-heading
  width: 10%

.code-review-links
  text-align: center

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
</style>
