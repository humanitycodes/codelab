<template>
  <div class="flex-row">
    <div class="flex-col">
      <label for="lesson-prereq-query">Prerequisites</label>
      <Dropdown
        :results="queryResults"
        :resultHandler="addPrereq"
        :resultContent="lesson => lesson.title || lesson.lessonKey"
      >
        <input
          ref="queryInput"
          v-model="prereqQuery"
          id="lesson-prereq-query"
          name="lesson-prereq-query"
          placeholder="Add prerequisite lessons"
        >
      </Dropdown>
      <ul v-if="prereqs.length">
        <li v-for="prereq in prereqs" :key="prereq.lessonId">
          {{ prereq.title || prereq.lessonKey }}
          <button
            @click="removePrereq(prereq)"
            class="inline danger"
            name="lesson-remove-prereq"
          >×</button>
        </li>
      </ul>
      <p v-else class="warning">
        Most lessons will have prerequisites. Are you sure there are no other
        lessons that should be completed before this one?
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
      return this.lessons.filter(lesson => (
        // Lesson is not self
        this.lesson.lessonId !== lesson.lessonId &&
        // Lesson is not already a prereq
        !this.lesson.prerequisiteLessonIds.includes(lesson.lessonId) &&
        // Lesson would not cause cyclical dependency (catch 22)
        this.prereqWouldBeAcyclic(lesson) &&
        // Lesson matches the query string
        (
          queryRegex.test(lesson.lessonKey) ||
          queryRegex.test(lesson.title)
        )
      ))
    },
    prereqs () {
      if (!this.lessons.length || !this.lesson.prerequisiteLessonIds) {
        return []
      }
      return this.lessons.filter(
        lesson => this.lesson.prerequisiteLessonIds.includes(lesson.lessonId)
      )
    }
  },
  methods: {
    addPrereq (prereq) {
      this.lesson.prerequisiteLessonIds.push(prereq.lessonId)
      this.prereqQuery = ''
      this.$refs.queryInput.focus()
    },
    removePrereq (prereq) {
      const index = this.lesson.prerequisiteLessonIds.indexOf(prereq.lessonId)
      this.lesson.prerequisiteLessonIds.splice(index, 1)
    },
    prereqWouldBeAcyclic (prereq) {
      const currentLessonId = this.lesson.lessonId
      const doesNotDependOnSelf = potentialPrereq => {
        if (potentialPrereq.prerequisiteLessonIds) {
          const prereqLessonIds = potentialPrereq.prerequisiteLessonIds
          const dependsOnSelf = prereqLessonIds.includes(currentLessonId)
          if (dependsOnSelf) {
            return false
          } else {
            return this.lessons.filter(
              lesson => prereqLessonIds.includes(lesson.lessonId)
            ).every(doesNotDependOnSelf)
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
