<template>
  <div class="flex-row">
    <div class="flex-col" :disabled="disabled">
      <label for="course-instructor-query">Instructors</label>
      <Dropdown
        :results="queryResults"
        :resultHandler="addInstructor"
        :resultContent="function (user) {
          return user.fullName + ' (' + user.email + ')'
        }"
      >
        <input
          :disabled="disabled"
          ref="queryInput"
          v-model="instructorQuery"
          id="course-instructor-query"
          name="course-instructor-query"
          placeholder="Add instructors to the course"
        >
      </Dropdown>
      <ul v-if="instructors.length">
        <li v-for="instructor in instructors">
          {{ instructor.fullName }}
          (<a
            :href="'mailto:' + instructor.email"
            target="_blank"
          >{{ instructor.email }}</a>)
          <button
            @click="removeInstructor(instructor)"
            class="inline danger"
            name="course-remove-instructor"
          >×</button>
        </li>
      </ul>
      <p v-else class="warning">
        You can't have a course without instructors! You must also add yourself if you'll be teaching this course.
      </p>
    </div>
  </div>
</template>

<script>
import Dropdown from './dropdown'
import { userGetters, roleGetters } from '@state/helpers'

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
      instructorQuery: ''
    }
  },
  computed: {
    ...roleGetters,
    ...userGetters,
    queryResults () {
      if (!this.instructorQuery || !this.users.length) return []
      const queryRegex = new RegExp(this.instructorQuery, 'i')
      return this.users.filter(user => {
        return (
          // User is not already a instructor
          this.course.instructorKeys.indexOf(user['.key']) === -1 &&
          // User has instructor role
          this.hasInstructorRole(user) &&
          // Course matches the query string
          (
            queryRegex.test(user.email) ||
            queryRegex.test(user.fullName)
          )
        )
      })
    },
    instructors () {
      if (!this.course.instructorKeys) return []
      return this.users.filter(user => {
        return this.course.instructorKeys.indexOf(user['.key']) !== -1
      })
    }
  },
  methods: {
    addInstructor (instructor) {
      this.course.addInstructor(instructor['.key'])
      this.instructorQuery = ''
      this.$refs.queryInput.focus()
    },
    removeInstructor (instructor) {
      this.course.removeInstructor(instructor['.key'])
    },
    hasInstructorRole (user) {
      const roles = this.roles.find(role => {
        return user['.key'] === role['.key']
      })
      return roles && !!roles['instructor']
    }
  }
}
</script>
