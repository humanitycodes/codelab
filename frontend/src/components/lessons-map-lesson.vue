<template>
  <span v-if="course">
    <router-link
      v-if="canUpdateCourse({ courseKey: course['.key'] })"
      :to="'/lessons/' + lesson['.key'] + '/edit'"
    ><button class="inline">Edit</button></router-link>
    <router-link
      :to="'/courses/' + course['.key'] + '/lessons/' + lesson['.key']"
    >{{ lesson.title || lesson['.key'] }}</router-link>
  </span>
  <span v-else>
    <router-link
      :to="'/lessons/' + lesson['.key'] + '/edit'"
    >{{ lesson.title || lesson['.key'] }}</router-link>
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
