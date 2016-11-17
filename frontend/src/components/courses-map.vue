<template>
  <div>
    <ul>
      <li v-for="course in courses" v-if="canReadCourse({ courseKey: course['.key'] })">
        <router-link v-if="canUpdateCourse({ courseKey: course['.key']})"
          :to="'/courses/' + course['.key'] + '/edit'"
        ><button class="inline">Edit</button></router-link>
        <router-link
          :to="'/courses/' + course['.key']"
        >{{ course.title || course['.key'] }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { coursePermissionMethods } from '@state/helpers'

export default {
  props: {
    courses: {
      type: Array,
      required: true
    }
  },
  methods: {
    ...coursePermissionMethods
  }
}
</script>
