<template>
  <div v-if="lesson">
    <LessonTitle :lesson="lesson"/>
    <LessonLearningObjectives :lesson="lesson"/>
    <LessonEstimatedHours :lesson="lesson"/>
    <LessonContent :lesson="lesson"/>
    <LessonProject :lesson="lesson"/>
    <LessonPrereqs :lesson="lesson"/>
    <LessonNotes :lesson ="lesson"/>
  </div>
</template>

<script>
import LessonTitle from './lesson-form-title'
import LessonLearningObjectives from './lesson-form-learning-objectives'
import LessonEstimatedHours from './lesson-form-estimated-hours'
import LessonContent from './lesson-form-content'
import LessonProject from './lesson-form-project'
import LessonPrereqs from './lesson-form-prereqs'
import LessonNotes from './lesson-form-notes'

export default {
  components: {
    LessonTitle, LessonLearningObjectives, LessonEstimatedHours, LessonContent, LessonProject, LessonPrereqs, LessonNotes
  },
  props: {
    lesson: {
      type: Object,
      required: true
    }
  }
}
</script>
