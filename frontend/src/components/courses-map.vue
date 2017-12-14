<template>
  <div>
    <ul>
      <li v-for="course in courses" v-if="canReadCourse({ courseKey: course['.key'] })">
        <router-link v-if="canUpdateCourse({ courseKey: course['.key']})"
          :to="'/courses/' + course['.key'] + '/edit'"
        >
          <button
            class="inline"
            :disabled="!isInstructorInCourse(course)"
            :title="titleForCourseEditButton(course)"
          >Edit</button>
        </router-link>
        <router-link
          :to="'/courses/' + course['.key']"
        >
          {{ course['.key'] }}
          <span v-if="course.title">
            ({{ course.title }})
          </span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import store from '@state/store'
import { coursePermissionMethods } from '@state/helpers'

export default {
  props: {
    courses: {
      type: Array,
      required: true
    }
  },
  methods: {
    ...coursePermissionMethods,
    isInstructorInCourse (course) {
      const currentUserKey = store.state.users.currentUser.uid
      return course.instructorKeys.indexOf(currentUserKey) !== -1
    },
    titleForCourseEditButton (course) {
      return this.isInstructorInCourse(course)
        ? '' : 'Only instructors assigned to this course can edit it'
    }
  }
}
</script>
