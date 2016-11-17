<template>
  <div>
    <ul>
      <li v-for="lesson in lessons">
        <LessonsMapLesson :lesson="lesson" :course="course"/>
      </li>
    </ul>
  </div>
</template>

<script>
import LessonsMapLesson from './lessons-map-lesson'

export default {
  components: {
    LessonsMapLesson
  },
  props: {
    lessons: {
      type: Array,
      required: true
    },
    course: Object
  }
}
</script>
