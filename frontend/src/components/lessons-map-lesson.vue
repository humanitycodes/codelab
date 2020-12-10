<template>
  <span v-if="courseKey">
    <router-link
      v-if="canUpdateCourse({ courseKey })"
      :to="'/lessons/' + lesson.lessonKey + '/edit'"
    ><button class="inline">Edit</button></router-link>
    <router-link
      :to="'/courses/' + courseKey + '/lessons/' + lesson.lessonKey"
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
    courseKey: String
  },
  methods: {
    canUpdateCourse
  }
}
</script>
