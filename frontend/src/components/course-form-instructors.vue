<template>
  <div class="stretch-row">
    <div class="stretch-col" :disabled="disabled">
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
        <li
          v-for="instructor in instructors"
          :key="instructor.userId"
        >
          {{ instructor.fullName }}
          (<a
            :href="'mailto:' + instructor.email"
            target="_blank"
          >{{ instructor.email }}</a>)
          <button
            :disabled="instructorHasProjectCompletions(instructor)"
            :title="
              instructorHasProjectCompletions(instructor)
                ? 'Instructors cannot be removed once they are assigned code reviews in the course'
                : 'Remove the instructor from this course'
            "
            @click="removeInstructor(instructor)"
            class="inline danger"
            name="course-remove-instructor"
          >×</button>
        </li>
      </ul>
      <p v-else class="warning">
        You can't have a course without instructors! You must also add yourself
        if you'll be teaching this course.
      </p>
    </div>
  </div>
</template>

<script>
import Dropdown from './dropdown'
import { userGetters, projectCompletionGetters } from '@state/helpers'

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
    ...projectCompletionGetters,
    queryResults () {
      if (!this.instructorQuery || !this.users.length) return []
      const queryRegex = new RegExp(this.instructorQuery, 'i')
      return this.users.filter(user => (
        // User has instructor role
        user.isInstructor &&
        // User is not already a instructor
        !this.course.instructorIds.includes(user.userId) &&
        // Course matches the query string
        (
          queryRegex.test(user.email) ||
          queryRegex.test(user.fullName)
        )
      ))
    },
    instructors () {
      return this.course.instructorIds.map(
        instructorId => this.users.find(user => user.userId === instructorId)
      )
    }
  },
  methods: {
    addInstructor (instructor) {
      this.course.instructorIds.push(instructor.userId)
      this.instructorQuery = ''
      this.$refs.queryInput.focus()
    },
    removeInstructor (instructor) {
      const index = this.course.instructorIds.indexOf(instructor.userId)
      this.course.instructorIds.splice(index, 1)
    },
    instructorHasProjectCompletions (instructor) {
      return this.projectCompletions.some(completion =>
        completion.courseId === this.course.courseId &&
        completion.instructorUserId === instructor.userId
      )
    }
  }
}
</script>
