<template>
  <div class="flex-row">
    <div class="flex-col">
      <div v-for="instructorCodeReviews in instructorCodeReviewsAwaitingFeedback">
        <InstructorCodeReviews
          :instructor="instructorCodeReviews.instructor"
          :codeReviews="instructorCodeReviews.codeReviews"
        />
      </div>
      <div v-if="!Object.keys(instructorCodeReviewsAwaitingFeedback).length">
        There are no code reviews awaiting feedback.
      </div>
    </div>
  </div>
</template>

<script>
import InstructorCodeReviews from '@components/code-reviews-instructor'
import { userGetters, lessonGetters } from '@state/helpers'
import courseUserGradeCurrentRounded from '@helpers/computed/course-user-grade-current-rounded'
import store from '@state/store'
import orderBy from 'lodash/orderBy'

export default {
  components: {
    InstructorCodeReviews
  },
  props: {
    courses: {
      type: Array,
      required: true
    }
  },
  methods: {
    getUser (userKey) {
      return this.users.find(user => user['.key'] === userKey)
    },
    getLesson (lessonKey) {
      return this.lessons.find(lesson => lesson['.key'] === lessonKey)
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
    instructorCodeReviewsAwaitingFeedback () {
      // Collection information about pending code reviews, grouped by instructor
      let instructorCodeReviews = {}
      this.courses.forEach(course => {
        course.projectCompletions.forEach(projectCompletion => {
          if (!projectCompletion.submission || projectCompletion.submission.instructorCommentedLast) return

          // Handle edge case where a project completion has been submitted
          // without an assigned instructor. Should only ever happen when
          // manually manipulating the database.
          if (!projectCompletion.submission.assignedInstructor) {
            projectCompletion.submission.assignedInstructor = course.instructorKeys[0]
          }

          if (!instructorCodeReviews[projectCompletion.submission.assignedInstructor]) {
            instructorCodeReviews[projectCompletion.submission.assignedInstructor] = []
          }

          const student = this.getUser(projectCompletion.students[0]['.key'])
          const grade = courseUserGradeCurrentRounded(course, student)
          instructorCodeReviews[projectCompletion.submission.assignedInstructor].push({
            course,
            projectCompletion,
            student,
            lesson: this.getLesson(projectCompletion.lessonKey),
            studentGradePoints: grade > 0 ? parseFloat(grade).toFixed(2) : 0
          })
        })
      })

      // Reorganize code reviews for each instructor
      let codeReviewGroups = []
      Object.keys(instructorCodeReviews).forEach(instructorKey => {
        codeReviewGroups.push({
          instructor: this.getUser(instructorKey),
          codeReviews: instructorCodeReviews[instructorKey]
        })
      })

      // Order code review groups by instructor name
      return orderBy(codeReviewGroups, [group => group.instructor.fullName])
    }
  }
}
</script>
