<template>
  <div class="flex-row">
    <div class="flex-col">
      <div v-for="reviewGroup in codeReviewsAwaitingFeedback">
        <h2>{{ reviewGroup.instructor.fullName }}</h2>
        <table>
          <thead>
            <th>GP</th>
            <th>Student</th>
            <th>Course</th>
            <th>Lesson</th>
            <th>Ext. Links</th>
          </thead>
          <tbody>
            <tr v-for="codeReview in reviewGroup.reviews">
              <td>
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
                <a :href="getFirstIssueUrl(codeReview)" target="_blank" class="external-icon" alt="Open the GitHub issue in a new tab" title="Open this issue on GitHub">
                  <span class="fa fa-exclamation-circle" aria-hidden="true"></span>
                </a>
                &nbsp;
                <a :href="getGitHubProjectUrl(codeReview)" target="_blank" class="external-icon" alt="Open the GitHub code in a new tab" title="View the code on GitHub">
                  <span class="fa fa-code" aria-hidden="true"></span>
                </a>
                &nbsp;
                <a :href="getProjectHostedUrl(codeReview)" target="_blank" class="external-icon" alt="Open the hosted site in a new tab" title="View the hosted site">
                  <span class="fa fa-globe" aria-hidden="true"></span>
                </a>
              </td>
              <td
                v-if="reviewGroup.instructor['.key'] === currentUser.uid"
                class="review-reassignment-control"
              >
                <select v-model="codeReview.project.submission.assignedInstructor">
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
import achievedGradePoints from '@helpers/achieved-grade-points'
import projectName from '@helpers/project-name'
import projectHostedUrl from '@helpers/project-hosted-url'
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
        this.getProjectName(codeReview)
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
    getProjectHostedUrl (codeReview) {
      console.error('lesson', codeReview.lesson)
      return projectHostedUrl(
        codeReview.student,
        codeReview.lesson.projects[0],
        codeReview.project,
        this.getProjectName(codeReview)
      )
    },
    getProjectName (codeReview) {
      return projectName(
        codeReview.course,
        codeReview.lesson,
        codeReview.project
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
    })
    // Retrieve the large fields so projects are available
    this.lessons.forEach(lesson => {
      store.dispatch('syncLargeFieldsOfResource', {
        resourceName: 'lessons',
        resourceKey: lesson['.key']
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
        course.projectCompletions.forEach(project => {
          if (!project.submission || project.submission.instructorCommentedLast) return

          // Handle edge case where a project has been submitted without an
          // assigned instructor. Should only ever happen when manually
          // manipulating the database.
          if (!project.submission.assignedInstructor) {
            project.submission.assignedInstructor = course.instructorKeys[0]
          }

          if (!instructorReviews[project.submission.assignedInstructor]) {
            instructorReviews[project.submission.assignedInstructor] = []
          }

          const student = this.getUser(project.students[0]['.key'])
          instructorReviews[project.submission.assignedInstructor].push({
            course,
            project,
            student,
            lesson: this.getLesson(project.lessonKey),
            studentPoints: achievedGradePoints(student, course)
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

table
  font-family: Lato, Verdana, Arial, sans-serif
  font-weight: 400

td .review-info-sensitive-data
  filter: blur(7px)
  transition: filter .3s
td:hover .review-info-sensitive-data
  filter: none

.review-info-key
  white-space: nowrap

.review-reassignment-control
  background-color: transparent
  border: none
  padding-top: 0
  padding-right: 0
  padding-bottom: 0
</style>
