<template>
  <div class="flex-row">
    <div class="flex-col">
      <div v-for="(codeReviews, instructorKey) in codeReviewsAwaitingFeedback">
        <h2>{{ getUser(instructorKey).fullName }}</h2>
        <ul>
          <li v-for="codeReview in codeReviews">
            {{ codeReview.student.fullName }}
            (<router-link :to="'/lessons/' + codeReview.lesson['.key']">Lesson</router-link>)
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
      let codeReviews = {}
      this.courses.forEach(course => {
        course.projectCompletions.forEach(project => {
          if (!project.submission || project.submission.instructorCommentedLast) return

          if (!codeReviews[project.submission.assignedInstructor]) {
            codeReviews[project.submission.assignedInstructor] = []
          }

          codeReviews[project.submission.assignedInstructor].push({
            course,
            project,
            lesson: this.getLesson(project.lessonKey),
            student: this.getUser(project.students[0]['.key'])
          })
        })
      })
      return codeReviews
    }
  }
}
</script>
