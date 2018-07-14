<template>
  <div class="flex-row">
    <div class="flex-col">
      <label for="course-lesson-query">Lessons</label>
      <Dropdown
        :results="queryResults"
        :resultHandler="addCourseLesson"
        :resultContent="lessonTitleOrKey"
      >
        <input
          ref="queryInput"
          v-model="lessonQuery"
          id="course-lesson-query"
          name="course-lesson-query"
          placeholder="Add lessons to the course"
        >
      </Dropdown>
      <ul v-if="courseLessons.length">
        <li
          v-for="lesson in courseLessons"
          :key="lesson.lessonId"
        >
          <LessonsMapLesson :lesson="lesson" :course="course"/>
          <button
            :disabled="lessonHasProjectCompletions(lesson)"
            :title="
              lessonHasProjectCompletions(lesson)
                ? 'Lessons cannot be removed once students have started projects for these lessons'
                : 'Remove the lesson from this course'
            "
            @click="showRemoveLessonModal(lesson)"
            class="inline danger"
            name="course-remove-lesson"
          >×</button>
        </li>
      </ul>
      <p v-else class="warning">
        If the course doesn't have any lessons, there won't be much for students
        to do!
      </p>
    </div>
    <ModalConfirm
      :show="showModalConfirmRemoveLesson"
      confirmClass="danger"
      confirmLabel="Delete"
      @close="onCloseRemoveLessonModal"
    >
      <p>
        Are you sure you want to remove
        <strong>{{ lessonTitleOrKey(lessonPendingRemoval) }}</strong>
        from the course?
      </p>
    </ModalConfirm>
  </div>
</template>

<script>
import { lessonGetters, projectCompletionGetters } from '@state/helpers'
import { lessonCanBeAddedToCourse } from '@state/auth/courses'
import Dropdown from './dropdown'
import ModalConfirm from './modal-confirm'
import LessonsMapLesson from './lessons-map-lesson'

export default {
  components: {
    Dropdown, LessonsMapLesson, ModalConfirm
  },
  props: {
    course: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      lessonQuery: '',
      lessonPendingRemoval: {},
      showModalConfirmRemoveLesson: false
    }
  },
  computed: {
    ...lessonGetters,
    ...projectCompletionGetters,
    queryResults () {
      if (!this.lessonQuery || !this.lessons.length) return []
      const queryRegex = new RegExp(this.lessonQuery, 'i')
      return this.lessons.filter(lesson => (
        lessonCanBeAddedToCourse({
          courseKey: this.course.courseKey,
          lessonKey: lesson.lessonKey
        }) &&
        // Lesson matches the query string
        (
          queryRegex.test(lesson.lessonKey) ||
          queryRegex.test(lesson.title)
        )
      ))
    },
    courseLessons () {
      return this.lessons.filter(
        lesson => this.course.lessonIds.includes(lesson.lessonId)
      )
    }
  },
  methods: {
    lessonTitleOrKey (lesson) {
      return lesson.title || lesson.lessonKey
    },
    addCourseLesson (lesson) {
      this.course.lessonIds.push(lesson.lessonId)
      this.lessonQuery = ''
      this.$refs.queryInput.focus()
    },
    lessonHasProjectCompletions (lesson) {
      return this.projectCompletions.some(
        completion => completion.lessonId === lesson.lessonId
      )
    },
    showRemoveLessonModal (lesson) {
      this.lessonPendingRemoval = lesson
      this.showModalConfirmRemoveLesson = true
    },
    onCloseRemoveLessonModal (confirmed) {
      this.showModalConfirmRemoveLesson = false
      if (confirmed) {
        const lessonId = this.lessonPendingRemoval.lessonId
        const index = this.course.lessonIds.indexOf(lessonId)
        this.course.lessonIds.splice(index, 1)
      }
    }
  }
}
</script>
