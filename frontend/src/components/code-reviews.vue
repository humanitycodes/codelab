<template>
  <div class="flex-row">
    <div class="flex-col">
      <div v-for="reviewGroup in codeReviewsAwaitingFeedback">
        <h2>{{ reviewGroup.instructor.fullName }}</h2>
        <table class="dashboard-info">
          <thead>
            <th class="numeric-cell">GP</th>
            <th>Student</th>
            <th>Course</th>
            <th>Lesson</th>
            <th>Links</th>
          </thead>
          <tbody>
            <tr v-for="codeReview in reviewGroup.reviews">
              <td class="numeric-cell">
                <span class="review-info-sensitive-data">
                  {{ codeReview.studentPoints }}
                </span>
              </td>
              <td>{{ codeReview.student.fullName }}</td>
              <td class="review-info-key">
                {{ humanizeCourseKey(codeReview.course['.key']) }}
              </td>
              <td class="review-info-key">
                <router-link :to="getCourseLessonUrl(codeReview)">
                  {{
                    codeReview.lesson['.key'].slice(0,20)
                  }}<span v-if="codeReview.lesson['.key'].length > 20">...</span>
                </router-link>
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
              </td>
              <td
                v-if="reviewGroup.instructor['.key'] === currentUser.uid"
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
import courseLessons from '@helpers/finders/course-lessons'
import courseUserGradeCurrentRounded from '@helpers/computed/course-user-grade-current-rounded'
import courseProjectCompletionRepoName from '@helpers/computed/course-project-completion-repo-name'
import courseProjectCompletionHostedUrl from '@helpers/computed/course-project-completion-hosted-url'
import store from '@state/store'
import sortBy from 'lodash/sortBy'

export default {
  props: {
    courses: {
      type: Array,
      required: true
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
    }
  },
  created () {
    // Retrieve the large fields so projectCompletions are available
    this.courses.forEach(course => {
      store.dispatch('syncLargeFieldsOfResource', {
        resourceName: 'courses',
        resourceKey: course['.key']
      })

      // Retrieve the large fields so projects are available
      courseLessons(course).forEach(lesson => {
        store.dispatch('syncLargeFieldsOfResource', {
          resourceName: 'lessons',
          resourceKey: lesson['.key']
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

.fa
  font-size: 1.4em

.code-review-links
  text-align: center

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
