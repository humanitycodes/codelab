<template>
  <div v-if="lesson">
    <LessonTitle :lesson="lesson"/>
    <LessonLearningObjectives :lesson="lesson"/>
    <LessonContent :lesson="lesson"/>
    <LessonPrereqs :lesson="lesson"/>
    <LessonNotes :lesson ="lesson"/>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import LessonTitle from './lesson-form-title'
import LessonLearningObjectives from './lesson-form-learning-objectives'
import LessonContent from './lesson-form-content'
import LessonPrereqs from './lesson-form-prereqs'
import LessonNotes from './lesson-form-notes'

export default {
  components: {
    LessonTitle, LessonLearningObjectives, LessonContent, LessonPrereqs, LessonNotes
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
