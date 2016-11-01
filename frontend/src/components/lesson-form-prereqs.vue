<template>
  <div class="form-field">
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
</template>

<script>
import Dropdown from './dropdown'
import db from '@plugins/firebase'

export default {
  components: {
    Dropdown
  },
  firebase: {
    lessons: db.ref('lessons')
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
    addPrereq (prereq) {
      db.ref('lessons')
        .child(this.lesson['.key'])
        .child('prereqKeys')
        .child(prereq['.key'])
        .set(true)
      this.prereqQuery = ''
      this.$refs.queryInput.focus()
    },
    removePrereq (prereq) {
      db.ref('lessons')
        .child(this.lesson['.key'])
        .child('prereqKeys')
        .child(prereq['.key'])
        .remove()
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
