<template>
  <div class="stretch-row">
    <div class="stretch-col">
      <label for="course-instructor-query">Instructors</label>
      <Dropdown
        :results="queryResults"
        :resultHandler="addInstructor"
        :resultContent="fullNameAndEmail"
      >
        <input
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
                ? 'This instructor has been assigned code reviews and cannot be removed'
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
import removeArrayValue from '@helpers/utils/remove-array-value'
import { userGetters, projectCompletionGetters } from '@state/helpers'

export default {
  components: {
    Dropdown
  },
  props: {
    courseId: {
      type: Number,
      required: true
    },
    instructorIds: {
      type: Array,
      default: () => []
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
        // User is not already an instructor
        !this.instructorIds.includes(user.userId) &&
        // User matches the query string
        (
          queryRegex.test(user.email) ||
          queryRegex.test(user.fullName)
        )
      ))
    },
    instructors () {
      return this.instructorIds.map(
        instructorId => this.users.find(user => user.userId === instructorId)
      )
    }
  },
  methods: {
    fullNameAndEmail (instructor) {
      return instructor.fullName + ' (' + instructor.email + ')'
    },
    addInstructor (instructor) {
      const modifiedInstructorIds = this.instructorIds.concat(instructor.userId)
      this.$emit('update:instructorIds', modifiedInstructorIds)
      this.instructorQuery = ''
      this.$refs.queryInput.focus()
    },
    removeInstructor (instructor) {
      const modifiedInstructorIds = removeArrayValue(
        this.instructorIds,
        instructor.userId
      )
      this.$emit('update:instructorIds', modifiedInstructorIds)
    },
    instructorHasProjectCompletions (instructor) {
      return this.projectCompletions.some(completion =>
        completion.courseId === this.courseId &&
        completion.instructorUserId === instructor.userId
      )
    }
  }
}
</script>
