<template>
  <div v-if="lesson">
    <label>Title</label>
    <input
      v-model="lesson.title"
      placeholder="A short description of the lesson in the infinitive form"
    >
    <p v-if="!lesson.title" class="warning">
      A title must be defined before a lesson can be added to a course.
    </p>
    <label>Learning Objectives</label>
    <LessonFormLearningObjectives :lesson="lesson"/>
    <label>Content</label>
    <textarea
      v-model="lesson.content"
      placeholder="Markdown explaining the lesson content"
    />
    <p v-if="!lesson.content" class="warning">
      A lesson must have content before being added to a course.
    </p>
    <label>Prerequisites</label>
    <LessonFormPrereqs :lesson="lesson"/>
    <label>Notes</label>
    <textarea
      v-model="lesson.notes"
      placeholder="Additional notes for future instructors"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import LessonFormLearningObjectives from './lesson-form-learning-objectives'
import LessonFormPrereqs from './lesson-form-prereqs'

export default {
  components: {
    LessonFormLearningObjectives, LessonFormPrereqs
  },
  props: {
    lesson: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      newLearningObjective: ''
    }
  },
  created () {
    this.updateLesson(this.lesson)
  },
  watch: {
    lesson: {
      deep: true,
      handler (newLesson) {
        this.updateLesson(newLesson)
      }
    }
  },
  methods: mapActions(['updateLesson'])
}
</script>
