<template>
  <div v-if="lesson">
    <p v-if="isLessonInActiveCourse" class="warning">
      This lesson is part of an active course. Please check with other instructors before making changes.
    </p>
    <p v-else-if="isLessonInCourse" class="warning">
      This lesson may be part of another active or archived course. Please be mindful when editing.
    </p>

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
import { courseGetters } from '@state/helpers'
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
  },
  computed: {
    ...courseGetters,
    isLessonInActiveCourse () {
      const now = Date.now()
      return this.courses.some(course => {
        if (!course.startDate || !course.endDate) return false
        return (
          course.lessonIds.indexOf(this.lesson.lessonId) !== -1 &&
          course.startDate < now &&
          course.endDate > now
        )
      })
    },
    isLessonInCourse () {
      return this.courses.some(
        course => course.lessonIds.indexOf(this.lesson.lessonId) !== -1
      )
    }
  }
}
</script>
