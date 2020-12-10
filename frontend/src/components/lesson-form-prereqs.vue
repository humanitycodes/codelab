<template>
  <div class="stretch-row">
    <div class="stretch-col">
      <label for="lesson-prereq-query">Prerequisites</label>
      <Dropdown
        :results="queryResults"
        :resultHandler="addPrereq"
        :resultContent="lessonTitleOrKey"
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
import removeArrayValue from '@helpers/utils/remove-array-value'

export default {
  components: {
    Dropdown
  },
  props: {
    lessonId: {
      type: Number,
      required: true
    },
    prerequisiteLessonIds: {
      type: Array,
      default: () => []
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
      try {
        const results = this.lessons.filter(lesson => (
          // Lesson is not self
          this.lessonId !== lesson.lessonId &&
          // Lesson is not already a prereq
          !this.prerequisiteLessonIds.includes(lesson.lessonId) &&
          // Lesson would not cause cyclical dependency (catch 22)
          this.prereqWouldBeAcyclic(lesson) &&
          // Lesson matches the query string
          (
            queryRegex.test(lesson.lessonKey) ||
            queryRegex.test(lesson.title)
          )
        ))
        return results
      } catch (error) {
        return []
      }
    },
    prereqs () {
      if (!this.prerequisiteLessonIds) {
        return []
      }
      return this.lessons.filter(lesson =>
        this.prerequisiteLessonIds.includes(lesson.lessonId)
      )
    }
  },
  methods: {
    lessonTitleOrKey (lesson) {
      return lesson.title || lesson.lessonKey
    },
    addPrereq (prereq) {
      const modifiedPrereqs = this.prerequisiteLessonIds.concat(prereq.lessonId)
      this.$emit('update:prerequisiteLessonIds', modifiedPrereqs)
      this.prereqQuery = ''
      this.$refs.queryInput.focus()
    },
    removePrereq (prereq) {
      const modifiedPrereqs = removeArrayValue(
        this.prerequisiteLessonIds,
        prereq.lessonId
      )
      this.$emit('update:prerequisiteLessonIds', modifiedPrereqs)
    },
    prereqWouldBeAcyclic (prereq) {
      const currentLessonId = this.lessonId
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
