<template>
  <div class="stretch-row">
    <div class="stretch-col">
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
          >Remove</button>
          <LessonsMapLesson :lesson="lesson" :course-key="courseKey"/>
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
import removeArrayValue from '@helpers/utils/remove-array-value'
import Dropdown from './dropdown'
import ModalConfirm from './modal-confirm'
import LessonsMapLesson from './lessons-map-lesson'

export default {
  components: {
    Dropdown,
    LessonsMapLesson,
    ModalConfirm
  },
  props: {
    courseId: {
      type: Number,
      required: true
    },
    courseKey: {
      type: String,
      required: true
    },
    lessonIds: {
      type: Array,
      default: () => []
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
          courseKey: this.courseKey,
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
        lesson => this.lessonIds.includes(lesson.lessonId)
      )
    }
  },
  methods: {
    lessonTitleOrKey (lesson) {
      return lesson.title || lesson.lessonKey
    },
    addCourseLesson (lesson) {
      const modifiedLessonIds = this.lessonIds.concat(lesson.lessonId)
      this.$emit('update:lessonIds', modifiedLessonIds)
      this.lessonQuery = ''
      this.$refs.queryInput.focus()
    },
    lessonHasProjectCompletions (lesson) {
      return this.projectCompletions.some(completion =>
        completion.courseId === this.courseId &&
        completion.lessonId === lesson.lessonId
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
        const modifiedLessonIds = removeArrayValue(this.lessonIds, lessonId)
        this.$emit('update:lessonIds', modifiedLessonIds)
      }
    }
  }
}
</script>
