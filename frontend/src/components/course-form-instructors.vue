<template>
  <div class="flex-row">
    <div class="flex-col" :disabled="disabled">
      <label>Enrolled instructors</label>
      <Dropdown
        :results="queryResults"
        :resultHandler="addinstructor"
        :resultContent="function (user) {
          return user.fullName + ' (' + user.email + ')'
        }"
      >
        <input
          :disabled="disabled"
          ref="queryInput"
          v-model="instructorQuery"
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
            @click="removeinstructor(instructor)"
            class="inline danger"
            name="course-remove-instructor"
          >X</button>
        </li>
      </ul>
      <p v-if="!instructors.length && !disabled" class="warning">
        It's hardly a course without instructors. Add some when you feel the course is ready to share.
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
      instructorQuery: ''
    }
  },
  computed: {
    ...userGetters,
    queryResults () {
      if (!this.instructorQuery || !this.users.length) return []
      const queryRegex = new RegExp(this.instructorQuery, 'i')
      return this.users.filter(user => {
        return (
          // User is not currentUser
          this.currentUser.uid !== user['.key'] &&
          // User is not already a instructor
          this.course.instructorKeys.indexOf(user['.key']) === -1 &&
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
    addinstructor (instructor) {
      this.course.addinstructor(instructor['.key'])
      this.instructorQuery = ''
      this.$refs.queryInput.focus()
    },
    removeinstructor (instructor) {
      this.course.removeinstructor(instructor['.key'])
    }
  }
}
</script>
