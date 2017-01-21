<template>
  <div class="flex-row">
    <div class="flex-col">
      <div v-for="reviewGroup in codeReviewsAwaitingFeedback">
        <h2>{{ reviewGroup.instructor.fullName }}</h2>
        <ul>
          <li v-for="codeReview in reviewGroup.reviews">
            {{ codeReview.course['.key'] }}
            -
            {{ codeReview.student.fullName }}
            (<router-link :to="getCourseLessonUrl(codeReview)">Lesson</router-link>)
            (<a :href="getIssuesUrl(codeReview)" target="_blank">GitHub Issue</a>)
          </li>
        </ul>
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
    getIssuesUrl (codeReview) {
      return [
        'https://github.com/',
        codeReview.student.github.login,
        '/',
        [
          codeReview.course['.key'],
          codeReview.lesson['.key'],
          codeReview.project.projectKey.slice(-6)
        ].join('-'),
        '/issues'
      ].join('')
    },
    getCourseLessonUrl (codeReview) {
      return [
        '/courses/',
        codeReview.course['.key'],
        '/lessons/',
        codeReview.lesson['.key']
      ].join('')
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

          // Manually assign the current user as an instructor
          // if no one else is assigned
          if (!project.submission.assignedInstructor) {
            project.submission.assignedInstructor = this.currentUser.uid
          }

          if (!instructorReviews[project.submission.assignedInstructor]) {
            instructorReviews[project.submission.assignedInstructor] = []
          }

          instructorReviews[project.submission.assignedInstructor].push({
            course,
            project,
            lesson: this.getLesson(project.lessonKey),
            student: this.getUser(project.students[0]['.key'])
          })
        })
      })

      // Reorganize and sort code reviews for each instructor
      let reviewGroups = []
      Object.keys(instructorReviews).forEach(instructorKey => {
        reviewGroups.push({
          instructor: this.getUser(instructorKey),
          reviews: sortBy(instructorReviews[instructorKey], [
            review => review.course['.key'],
            review => review.student.fullName,
            review => review.lesson['.key']
          ])
        })
      })
      // Order code review groups by instructor name
      return sortBy(reviewGroups, [group => group.instructor.fullName])
    }
  }
}
</script>
