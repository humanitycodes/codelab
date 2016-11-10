<template>
  <div class="form-row">
    <div class="form-group">
      <label>Lessons</label>
      <Dropdown
        :results="queryResults"
        :resultHandler="addCourseLesson"
        :resultContent="function (lesson) {
          return lesson.title || lesson['.key']
        }"
      >
        <input
          ref="queryInput"
          v-model="lessonQuery"
          placeholder="Add lessons to the course"
        >
      </Dropdown>
      <ul v-if="courseLessons.length">
        <li v-for="lesson in courseLessons">
          {{ lesson.title || lesson['.key'] }}
          <button
            @click="removeCourseLesson(lesson)"
            class="inline danger"
          >X</button>
        </li>
      </ul>
      <p v-else class="warning">
        If the course doesn't have any lessons, there won't be much for students to do!
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
    course: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      lessonQuery: ''
    }
  },
  computed: {
    ...lessonGetters,
    queryResults () {
      if (!this.lessonQuery || !this.lessons.length) return []
      const queryRegex = new RegExp(this.lessonQuery, 'i')
      const courseLessonKeys = this.courseLessons.map(p => p['.key'])
      return this.lessons.filter(lesson => {
        return (
          // Lesson is not self
          this.course['.key'] !== lesson['.key'] &&
          // Lesson is not already a courseLesson
          courseLessonKeys.indexOf(lesson['.key']) === -1 &&
          // Lesson matches the query string
          (
            queryRegex.test(lesson['.key']) ||
            queryRegex.test(lesson.title)
          )
        )
      })
    },
    courseLessons () {
      if (!this.lessons.length || !this.course.lessonKeys) {
        return []
      }
      const courseLessonKeys = Object.keys(this.course.lessonKeys)
      return this.lessons.filter(lesson => {
        return courseLessonKeys.indexOf(lesson['.key']) !== -1
      })
    }
  },
  methods: {
    ...mapActions(['addLessonToCourse', 'removeLessonFromCourse']),
    addCourseLesson (lesson) {
      this.addLessonToCourse({
        courseKey: this.course['.key'],
        lessonKey: lesson['.key']
      }).then(() => {
        this.lessonQuery = ''
        this.$refs.queryInput.focus()
      })
    },
    removeCourseLesson (lesson) {
      this.removeLessonFromCourse({
        courseKey: this.course['.key'],
        lessonKey: lesson['.key']
      })
    }
  }
}
</script>
