<template>
  <div class="form-row">
    <div class="form-group">
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
          placeholder="Add prerequisite lessons"
        >
      </Dropdown>
      <ul v-if="prereqs.length">
        <li v-for="prereq in prereqs">
          {{ prereq.title || prereq['.key'] }}
          <button
            @click="removePrereq(prereq)"
            class="inline danger"
          >X</button>
        </li>
      </ul>
      <p v-else class="warning">
        Most lessons will have prerequisites. Are you sure there are no other lessons that should be completed before this one?
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
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
      const prereqKeys = this.prereqs.map(p => p['.key'])
      return this.lessons.filter(lesson => {
        return (
          // Lesson is not self
          this.lesson['.key'] !== lesson['.key'] &&
          // Lesson is not already a prereq
          prereqKeys.indexOf(lesson['.key']) === -1 &&
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
      const prereqKeys = Object.keys(this.lesson.prereqKeys)
      return this.lessons.filter(lesson => {
        return prereqKeys.indexOf(lesson['.key']) !== -1
      })
    }
  },
  methods: {
    ...mapActions(['addLessonPrereq', 'removeLessonPrereq']),
    addPrereq (prereq) {
      this.addLessonPrereq({
        lessonKey: this.lesson['.key'],
        prereqKey: prereq['.key']
      }).then(() => {
        this.prereqQuery = ''
        this.$refs.queryInput.focus()
      })
    },
    removePrereq (prereq) {
      this.removeLessonPrereq({
        lessonKey: this.lesson['.key'],
        prereqKey: prereq['.key']
      })
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
