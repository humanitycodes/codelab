<template>
  <div class="flex-row">
    <div class="flex-col" :disabled="disabled">
      <label>Enrolled Students</label>
      <Dropdown
        :results="queryResults"
        :resultHandler="addStudent"
        :resultContent="function (user) {
          return user.fullName + ' (' + user.email + ')'
        }"
      >
        <input
          :disabled="disabled"
          ref="queryInput"
          v-model="studentQuery"
          name="course-student-query"
          placeholder="Add students to the course"
          @keyup.enter="addPreenrollment"
        >
      </Dropdown>
      <ul v-if="students.length">
        <li v-for="student in students">
          {{ student.fullName }}
          (<a
            :href="'mailto:' + student.email"
            target="_blank"
          >{{ student.email }}</a>)
          <button
            @click="removeStudent(student)"
            class="inline danger"
            name="course-remove-student"
          >×</button>
        </li>
      </ul>
      <p v-if="preenrollments.length" class="warning">
        The following students are enrolled, but have not signed in.
      </p>
      <ul v-if="preenrollments.length">
        <li v-for="preenrollment in preenrollments">
          <a
            :href="'mailto:' + preenrollment['.key']"
            target="_blank"
          >{{ preenrollment['.key'] }}</a>
          <button
            @click="removePreenrollment(preenrollment['.key'])"
            class="inline danger"
            name="course-remove-student"
          >×</button>
        </li>
      </ul>
      <p
        v-if="!students.length && !preenrollments.length && !disabled"
        class="warning"
      >
        It's hardly a course without students. Add some when you feel the course is ready to share.
      </p>
    </div>
  </div>
</template>

<script>
import Dropdown from './dropdown'
import { userGetters } from '@state/helpers'

export default {
  components: {
    Dropdown
  },
  props: {
    course: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      studentQuery: ''
    }
  },
  computed: {
    ...userGetters,
    queryResults () {
      if (!this.studentQuery || !this.users.length) return []
      const queryRegex = new RegExp(this.studentQuery, 'i')
      return this.users.filter(user => {
        return (
          // User is not currentUser
          this.currentUser.uid !== user['.key'] &&
          // User is not already a student
          this.course.studentKeys.indexOf(user['.key']) === -1 &&
          // Course matches the query string
          (
            queryRegex.test(user.email) ||
            queryRegex.test(user.fullName)
          )
        )
      })
    },
    students () {
      if (!this.course.studentKeys) return []
      return this.users.filter(user => {
        return this.course.studentKeys.indexOf(user['.key']) !== -1
      })
    },
    preenrollments () {
      return this.course.preenrollments || []
    }
  },
  methods: {
    addStudent (student) {
      if (!student) return
      this.course.addStudent(student['.key'])
      this.studentQuery = ''
      this.$refs.queryInput.focus()
    },
    removeStudent (student) {
      this.course.removeStudent(student['.key'])
    },
    addPreenrollment () {
      if (!this.queryResults.length &&
        /^[\w.]+@msu\.edu/.test(this.studentQuery)) {
        this.course.preenrollments.add({}, this.studentQuery)
        this.studentQuery = ''
        this.$refs.queryInput.focus()
      }
    },
    removePreenrollment (email) {
      this.course.preenrollments.remove(email)
    }
  }
}
</script>
