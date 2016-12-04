<template>
  <div class="flex-row">
    <div class="flex-col">
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
          <LessonsMapLesson :lesson="lesson" :course="course"/>
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
import { lessonGetters } from '@state/helpers'
import { lessonCanBeAddedToCourse } from '@state/auth/courses'
import Dropdown from './dropdown'
import LessonsMapLesson from './lessons-map-lesson'

export default {
  components: {
    Dropdown, LessonsMapLesson
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
      return this.lessons.filter(lesson => {
        return (
          lessonCanBeAddedToCourse({
            courseKey: this.course['.key'],
            lessonKey: lesson['.key']
          }) &&
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
      return this.lessons.filter(lesson => {
        return this.course.lessonKeys.indexOf(lesson['.key']) !== -1
      })
    }
  },
  methods: {
    addCourseLesson (lesson) {
      this.course.addLesson(lesson['.key'])
      this.lessonQuery = ''
      this.$refs.queryInput.focus()
    },
    removeCourseLesson (lesson) {
      this.course.removeLesson(lesson['.key'])
    }
  }
}
</script>
