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
          placeholder="Add students to the course"
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
          >X</button>
        </li>
      </ul>
      <p v-if="!students.length && !disabled" class="warning">
        It's hardly a course without students. Add some when you feel the course is ready to share.
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
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
      const studentKeys = this.students.map(p => p['.key'])
      return this.users.filter(user => {
        return (
          // User is not currentUser
          this.currentUser.uid !== user['.key'] &&
          // User is not already a student
          studentKeys.indexOf(user['.key']) === -1 &&
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
      const studentKeys = Object.keys(this.course.studentKeys)
      return this.users.filter(user => {
        return studentKeys.indexOf(user['.key']) !== -1
      })
    }
  },
  methods: {
    ...mapActions(['addStudentToCourse', 'removeStudentFromCourse']),
    addStudent (student) {
      this.addStudentToCourse({
        courseKey: this.course['.key'],
        studentKey: student['.key']
      }).then(() => {
        this.studentQuery = ''
        this.$refs.queryInput.focus()
      })
    },
    removeStudent (student) {
      this.removeStudentFromCourse({
        courseKey: this.course['.key'],
        studentKey: student['.key']
      })
    }
  }
}
</script>
