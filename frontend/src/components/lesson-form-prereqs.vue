<template>
  <div class="flex-row">
    <div class="flex-col">
      <label>Prerequisites</label>
      <Dropdown
        :results="queryResults"
        :resultHandler="addPrereq"
        :resultContent="function (lesson) {
          return lesson.title || lesson['.key']
        }"
      >
        <input
          ref="queryInput"
          v-model="prereqQuery"
          name="lesson-prereq-query"
          placeholder="Add prerequisite lessons"
        >
      </Dropdown>
      <ul v-if="prereqs.length">
        <li v-for="prereq in prereqs">
          {{ prereq.title || prereq['.key'] }}
          <button
            @click="removePrereq(prereq)"
            class="inline danger delete"
            name="lesson-remove-prereq"
          >×</button>
        </li>
      </ul>
      <p v-else class="warning">
        Most lessons will have prerequisites. Are you sure there are no other lessons that should be completed before this one?
      </p>
    </div>
  </div>
</template>

<script>
import Dropdown from './dropdown'
import { lessonGetters } from '@state/helpers'

export default {
  components: {
    Dropdown
  },
  props: {
    lesson: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      prereqQuery: ''
    }
  },
  computed: {
    ...lessonGetters,
    queryResults () {
      if (!this.prereqQuery || !this.lessons.length) return []
      const queryRegex = new RegExp(this.prereqQuery, 'i')
      return this.lessons.filter(lesson => {
        return (
          // Lesson is not self
          this.lesson['.key'] !== lesson['.key'] &&
          // Lesson is not already a prereq
          this.lesson.prereqKeys.indexOf(lesson['.key']) === -1 &&
          // Lesson would not cause cyclical dependency (catch 22)
          this.prereqWouldBeAcyclic(lesson) &&
          // Lesson matches the query string
          (
            queryRegex.test(lesson['.key']) ||
            queryRegex.test(lesson.title)
          )
        )
      })
    },
    prereqs () {
      if (!this.lessons.length || !this.lesson.prereqKeys) {
        return []
      }
      return this.lessons.filter(lesson => {
        return this.lesson.prereqKeys.indexOf(lesson['.key']) !== -1
      })
    }
  },
  methods: {
    addPrereq (prereq) {
      this.lesson.addPrereq(prereq['.key'])
      this.prereqQuery = ''
      this.$refs.queryInput.focus()
    },
    removePrereq (prereq) {
      this.lesson.removePrereq(prereq['.key'])
    },
    prereqWouldBeAcyclic (prereq) {
      const currentLessonKey = this.lesson['.key']
      const doesNotDependOnSelf = potentialPrereq => {
        if (potentialPrereq.prereqKeys) {
          const keys = Object.keys(potentialPrereq.prereqKeys)
          const dependsOnSelf = keys.indexOf(currentLessonKey) !== -1
          if (dependsOnSelf) {
            return false
          } else {
            return this.lessons.filter(lesson => {
              return keys.indexOf(lesson['.key']) !== -1
            }).every(doesNotDependOnSelf)
          }
        } else {
          return true
        }
      }
      return doesNotDependOnSelf(prereq)
    }
  }
}
</script>
