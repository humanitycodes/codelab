<template>
  <div class="stretch-row">
    <div class="stretch-col">
      <div
        v-for="(instructorCodeReviews, index) in instructorCodeReviewsAwaitingFeedback"
        :key="index"
      >
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
import { projectCompletionGetters } from '@state/helpers'
import courseUserGradeCurrentRounded from '@helpers/computed/course-user-grade-current-rounded'
import lessonById from '@helpers/finders/lesson-by-id'
import userById from '@helpers/finders/user-by-id'
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
  computed: {
    ...projectCompletionGetters,
    instructorCodeReviewsAwaitingFeedback () {
      // Collect information about pending code reviews, grouped by instructor
      const instructorCodeReviews = {}
      this.projectCompletions.forEach(projectCompletion => {
        // Exclude projects that haven't been submitted or don't need
        // the instructor's attention
        if (
          !projectCompletion.firstSubmittedAt ||
          projectCompletion.instructorCommentedLast ||
          !projectCompletion.instructorUserId
        ) return

        // Find the course in the ones provided to this component to make sure
        // the current user has permission to do code reviews for the course
        const course = this.courses.find(
          course => course.courseId === projectCompletion.courseId
        )
        if (!course) return

        const lesson = lessonById(projectCompletion.lessonId)
        const student = userById(projectCompletion.studentUserId)
        const grade = courseUserGradeCurrentRounded(course, student)
        const studentGradePoints = grade > 0 ? parseFloat(grade).toFixed(2) : 0

        // Make sure there's an array to hold the instructor's reviews
        if (!instructorCodeReviews[projectCompletion.instructorUserId]) {
          instructorCodeReviews[projectCompletion.instructorUserId] = []
        }

        instructorCodeReviews[projectCompletion.instructorUserId].push({
          course, projectCompletion, student, lesson, studentGradePoints
        })
      })

      // Reorganize code reviews for each instructor
      const codeReviewGroups = []
      Object.keys(instructorCodeReviews).forEach(instructorUserId => {
        // Object keys are strings, so convert these IDs back to numbers
        const userId = parseInt(instructorUserId)
        codeReviewGroups.push({
          instructor: userById(userId),
          codeReviews: instructorCodeReviews[userId]
        })
      })

      // Order code review groups by instructor name
      return orderBy(codeReviewGroups, [group => group.instructor.fullName])
    }
  }
}
</script>
