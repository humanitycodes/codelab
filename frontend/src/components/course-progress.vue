<template>
  <details v-if="isCourseInProgress && studentsInCourse.length">
    <summary>{{ course['.key'] }}</summary>
    <table>
      <tr>
        <th></th>
        <th>
          Grade Points<br>
          Expected: {{ expectedGradePoints }}
        </th>
        <th>
          # Lessons<br>
          Behind/Ahead
        </th>
        <th>
          # Lessons<br>
          In Progress
        </th>
      </tr>
      <tr v-for="student in studentsInCourse">
        <td :class="{ 'warning-grade': behindByLessonCount(student) <= lessonWarningThreshold }">
          {{ student.fullName }}
        </td>
        <td
          class="numeric-cell"
          :class="{ 'warning-grade': behindByLessonCount(student) <= lessonWarningThreshold }"
        >
          {{ achievedGradePoints(student) }}
        </td>
        <td
          class="numeric-cell"
          :class="{ 'warning-grade': behindByLessonCount(student) <= lessonWarningThreshold }"
        >
          {{ behindByLessonCount(student) }}
        </td>
        <td class="numeric-cell">
          {{ inProgressLessonCount(student) }}
        </td>
      </tr>
    </table>
  </details>
</template>

<script>
import { userGetters } from '@state/helpers'
import achievedGradePoints from '@helpers/achieved-grade-points'
import minGradeExpectation from '@helpers/min-grade-expectation'
import averageLessonGradePoints from '@helpers/average-lesson-grade-points'

export default {
  props: {
    course: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      lessonWarningThreshold: -3
    }
  },
  computed: {
    ...userGetters,
    expectedGradePoints () {
      return Number(minGradeExpectation(this.course)).toFixed(2)
    },
    isCourseInProgress () {
      const now = Date.now()
      return this.course.startDate <= now && now <= this.course.endDate
    },
    studentsInCourse () {
      return this.course.studentKeys.map(studentKey => {
        return this.users.find(user => user['.key'] === studentKey)
      }).sort((student1, student2) => {
        const student1Progress = this.achievedGradePoints(student1)
        const student2Progress = this.achievedGradePoints(student2)

        // Sort by course progress, then by name
        if (student1Progress === student2Progress) {
          return student1.fullName.toLowerCase() < student2.fullName.toLowerCase() ? -1 : 1
        }
        return student1Progress < student2Progress ? -1 : 1
      })
    }
  },
  methods: {
    achievedGradePoints (student) {
      const gpa = achievedGradePoints(student, this.course)
      return Number(gpa).toFixed(2)
    },
    behindByLessonCount (student) {
      const achievedGradePoints = this.achievedGradePoints(student)
      return Math.round((achievedGradePoints - this.expectedGradePoints) / averageLessonGradePoints(this.course))
    },
    inProgressLessonCount (student) {
      return this.course.projectCompletions.filter(completion => {
        return (
          completion.students[0]['.key'] === student['.key'] &&
          (
            !completion.submission ||
            (
              !completion.submission.isApproved &&
              completion.submission.instructorCommentedLast
            )
          )
        )
      }).length
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../meta'

table
  border-collapse: separate
  empty-cells: hide

.numeric-cell
  text-align: right

.warning-grade
  color: $design.branding.danger.light
</style>
