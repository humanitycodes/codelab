<template>
  <details v-if="isCourseInProgress && studentsInCourse.length">
    <summary>{{ course['.key'] }}</summary>
    <table>
      <tr>
        <th>Expected Grade Points</th>
        <th>{{ expectedGradePoints }}</th>
      </tr>
      <tr v-for="student in studentsInCourse">
        <td>{{ student.fullName }}</td>
        <td>{{ achievedGradePoints(student) }}</td>
      </tr>
      <tr>
        <th>Expected Grade Points</th>
        <th>{{ expectedGradePoints }}</th>
      </tr>
    </table>
  </details>
</template>

<script>
import { userGetters } from '@state/helpers'
import achievedGradePoints from '@helpers/achieved-grade-points'

export default {
  props: {
    course: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...userGetters,
    expectedGradePoints () {
      return 0
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
    }
  }
}
</script>
