<template>
  <span v-if="course">
    <router-link
      v-if="canUpdateCourse({ courseKey: course.courseKey })"
      :to="'/lessons/' + lesson.lessonKey + '/edit'"
    ><button class="inline">Edit</button></router-link>
    <router-link
      :to="'/courses/' + course.courseKey + '/lessons/' + lesson.lessonKey"
    >{{ lesson.title || lesson.lessonKey }}</router-link>
  </span>
  <span v-else>
    <router-link
      :to="'/lessons/' + lesson.lessonKey + '/edit'"
    >{{ lesson.title || lesson.lessonKey }}</router-link>
  </span>
</template>

<script>
import { canUpdateCourse } from '@state/auth/courses'

export default {
  props: {
    lesson: {
      type: Object,
      required: true
    },
    course: Object
  },
  methods: {
    canUpdateCourse
  }
}
</script>
