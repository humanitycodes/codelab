<template>
  <div class="flex-row">
    <div class="flex-col">
      <div v-for="reviewGroup in codeReviewsAwaitingFeedback">
        <h2>{{ reviewGroup.instructor.fullName }}</h2>
        <table class="dashboard-info">
          <thead>
            <th
              id="grade-point-heading"
              class="numeric-cell"
              @mouseover="showAllSensitiveData = true"
              @mouseout="showAllSensitiveData = false"
            >
              GP
            </th>
            <th id="student-heading">Student</th>
            <th id="course-heading">Course</th>
            <th id="lesson-heading">Lesson</th>
            <th
              id="project-age-heading"
              class="numeric-cell"
              title="The number of days since the project was first submitted"
            >
              Project Age
            </th>
            <th
              id="last-updated-heading"
              class="numeric-cell"
              title="The date on which the project was last updated"
            >
              Last Updated
            </th>
            <th id="links-heading">Links</th>
          </thead>
          <tbody>
            <tr v-for="codeReview in reviewGroup.reviews">
              <td class="numeric-cell">
                <span :class="{ 'review-info-sensitive-data': !showAllSensitiveData }">
                  {{ codeReview.studentPoints }}
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
                  <span class="fa fa-exclamation-circle" aria-hidden="true" title="Open this issue on GitHub"></span>
                </a>
                &nbsp;
                <a :href="getGitHubProjectUrl(codeReview)" target="_blank" class="icon-link" alt="Open the GitHub code in a new tab" aria-label="GitHub Code">
                  <span class="fa fa-code" aria-hidden="true" title="View the code on GitHub"></span>
                </a>
                &nbsp;
                <a :href="getHostedUrl(codeReview)" target="_blank" class="icon-link" alt="Open the hosted site in a new tab" aria-label="Hosted Site">
                  <span class="fa fa-globe" aria-hidden="true" title="View the hosted site"></span>
                </a>
                &nbsp;
                <a :href="getValidatorUrl(codeReview)" target="_blank" class="icon-link" alt="Open validator errors in a new tab" aria-label="W3 Validator">
                  <span class="fa fa-check-circle" aria-hidden="true" title="View the W3 validator"></span>
                </a>
              </td>
              <td
                class="review-reassignment-control"
              >
                <select
                  v-model="codeReview.projectCompletion.submission.assignedInstructor"
                  aria-label="Reassign this review"
                >
                  <option
                    v-for="instructorKey in codeReview.course.instructorKeys"
                    :value="instructorKey"
                  >
                    {{ getInstructorInitialsFromKey(instructorKey) }}
                  </option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="!Object.keys(codeReviewsAwaitingFeedback).length">
        There are no code reviews awaiting feedback.
      </div>
    </div>
  </div>
</template>

<script>
import {
  coursePermissionMethods, userGetters, lessonGetters
} from '@state/helpers'
import courseUserGradeCurrentRounded from '@helpers/computed/course-user-grade-current-rounded'
import courseProjectCompletionRepoName from '@helpers/computed/course-project-completion-repo-name'
import courseProjectCompletionHostedUrl from '@helpers/computed/course-project-completion-hosted-url'
import store from '@state/store'
import sortBy from 'lodash/sortBy'
import differenceInDays from 'date-fns/difference_in_days'
import formatDate from 'date-fns/format'
import mostRecentDate from 'date-fns/max'

export default {
  props: {
    courses: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      showAllSensitiveData: false
    }
  },
  methods: {
    ...coursePermissionMethods,
    getUser (userKey) {
      return this.users.find(user => user['.key'] === userKey)
    },
    getLesson (lessonKey) {
      return this.lessons.find(lesson => lesson['.key'] === lessonKey)
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
    getProjectCompletionLastUpdatedDateFormatted (codeReview) {
      const projectSubmission = codeReview.projectCompletion.submission
      const lastUpdatedDate = mostRecentDate(
        projectSubmission.approvedAt || 0,
        projectSubmission.firstSubmittedAt || 0,
        projectSubmission.lastCommentedAt || 0,
        codeReview.projectCompletion.repositoryCreatedAt || 0,
        codeReview.projectCompletion.firstCommittedAt || 0
      )
      return formatDate(lastUpdatedDate, 'MMM D')
    }
  },
  created () {
    // Retrieve the large fields so projectCompletions are available
    this.courses.forEach(course => {
      if (!course) return

      store.dispatch('syncLargeFieldsOfResource', {
        resourceName: 'courses',
        resourceKey: course['.key']
      })

      // Retrieve the large fields so projects are available
      course.lessonKeys.forEach(lessonKey => {
        store.dispatch('syncLargeFieldsOfResource', {
          resourceName: 'lessons',
          resourceKey: lessonKey
        })
      })
    })
  },
  computed: {
    ...userGetters,
    ...lessonGetters,
    codeReviewsAwaitingFeedback () {
      // Collection information about pending code reviews, grouped by instructor
      let instructorReviews = {}
      this.courses.forEach(course => {
        course.projectCompletions.forEach(projectCompletion => {
          if (!projectCompletion.submission || projectCompletion.submission.instructorCommentedLast) return

          // Handle edge case where a project completion has been submitted
          // without an assigned instructor. Should only ever happen when
          // manually manipulating the database.
          if (!projectCompletion.submission.assignedInstructor) {
            projectCompletion.submission.assignedInstructor = course.instructorKeys[0]
          }

          if (!instructorReviews[projectCompletion.submission.assignedInstructor]) {
            instructorReviews[projectCompletion.submission.assignedInstructor] = []
          }

          const student = this.getUser(projectCompletion.students[0]['.key'])
          const grade = courseUserGradeCurrentRounded(course, student)
          instructorReviews[projectCompletion.submission.assignedInstructor].push({
            course,
            projectCompletion,
            student,
            lesson: this.getLesson(projectCompletion.lessonKey),
            studentPoints: grade > 0 ? parseFloat(grade).toFixed(2) : 0
          })
        })
      })

      // Reorganize and sort code reviews for each instructor
      let reviewGroups = []
      Object.keys(instructorReviews).forEach(instructorKey => {
        reviewGroups.push({
          instructor: this.getUser(instructorKey),
          reviews: sortBy(instructorReviews[instructorKey], [
            review => review.studentPoints
          ])
        })
      })
      // Order code review groups by instructor name
      return sortBy(reviewGroups, [group => group.instructor.fullName])
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../meta'

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

.fa
  font-size: 1.4em

.code-review-links
  text-align: center

td
  white-space: nowrap

td .review-info-sensitive-data
  filter: blur(7px)
  transition: filter .3s

td:hover .review-info-sensitive-data
  filter: none

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
