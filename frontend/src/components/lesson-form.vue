<template>
  <div>
    <p v-if="isLessonInActiveCourse" class="warning">
      This lesson is part of an active course. Please check with other instructors before making changes.
    </p>
    <p v-else-if="isLessonInCourse" class="warning">
      This lesson may be part of another active or archived course. Please be mindful when editing.
    </p>

    <LessonTitle v-on="$listeners" :title="title"/>
    <LessonLearningObjectives
      v-on="$listeners"
      :learning-objectives="learningObjectives"
    />
    <LessonEstimatedHours v-on="$listeners" :estimated-hours="estimatedHours"/>
    <LessonContent v-on="$listeners" :content="content"/>
    <LessonProject
      v-on="$listeners"
      :project-hosting="projectHosting"
      :project-title="projectTitle"
      :project-criteria="projectCriteria"
    />
    <LessonPrereqs
      v-on="$listeners"
      :lesson-id="lessonId"
      :prerequisite-lesson-ids="prerequisiteLessonIds"
    />
    <LessonNotes v-on="$listeners" :notes="notes"/>
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
    LessonTitle,
    LessonLearningObjectives,
    LessonEstimatedHours,
    LessonContent,
    LessonProject,
    LessonPrereqs,
    LessonNotes
  },
  props: {
    lessonId: Number,
    lessonKey: String,
    content: String,
    estimatedHours: Number,
    learningObjectives: Array,
    notes: String,
    prerequisiteLessonIds: Array,
    projectHosting: String,
    projectTitle: String,
    projectCriteria: Array,
    title: String
  },
  computed: {
    ...courseGetters,
    isLessonInActiveCourse () {
      const now = Date.now()
      return this.courses.some(course => {
        if (!course.startDate || !course.endDate) return false
        return (
          course.lessonIds.includes(this.lessonId) &&
          course.startDate < now &&
          course.endDate > now
        )
      })
    },
    isLessonInCourse () {
      return this.courses.some(
        course => course.lessonIds.includes(this.lessonId)
      )
    }
  }
}
</script>
