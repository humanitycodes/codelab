<template>
  <details v-if="isCourseInProgress && studentsInCourse.length">
    <summary>{{ course['.key'] }}</summary>
    <ol>
      <li v-for="student in studentsInCourse">
        {{ student.fullName }}
      </li>
    </ol>
  </details>
</template>

<script>
import { userGetters } from '@state/helpers'

export default {
  props: {
    course: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...userGetters,
    isCourseInProgress () {
      const now = Date.now()
      return this.course.startDate <= now && now <= this.course.endDate
    },
    studentsInCourse () {
      return this.course.studentKeys.map(studentKey => {
        return this.users.find(user => user['.key'] === studentKey)
      }).sort((student1, student2) => {
        const student1Progress = this.studentProgress(student1)
        const student2Progress = this.studentProgress(student2)

        if (student1Progress === student2Progress) {
          return student1['.key'] < student2['.key']
        }
        return student1Progress < student2Progress ? -1 : 1
      })
    }
  },
  methods: {
    studentProgress (student) {
      return student.fullName.toLowerCase()
    }
  }
}
</script>
