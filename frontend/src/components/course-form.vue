<template>
  <div v-if="course">
    <label>Title</label>
    <input
      v-model="course.title"
      placeholder="A short description of the course in the infinitive form"
    >
    <p v-if="!course.title" class="warning">
      A title must be defined before students can be enrolled in a course.
    </p>
    <label>Content</label>
    <textarea
      v-model="course.syllabus"
      placeholder="The structure and rules of the course"
    />
    <p v-if="!course.syllabus" class="warning">
      A syllabus must be defined before students can be enrolled in a course.
    </p>
    <div class="form-row">
      <div class="form-group">
        <label>Start Date</label>
        <DatePicker v-model="course.startDate">
      </div>
      <div class="form-group">
        <label>End Date</label>
        <DatePicker v-model="course.endDate" at-day="end">
      </div>
    </div>
    <pre>{{ course }}</pre>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import DatePicker from './date-picker'

export default {
  components: {
    DatePicker
  },
  props: {
    course: {
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
    this.updateCourse(this.course)
  },
  watch: {
    course: {
      deep: true,
      handler (newCourse) {
        this.updateCourse(newCourse)
      }
    }
  },
  methods: mapActions(['updateCourse'])
}
</script>
