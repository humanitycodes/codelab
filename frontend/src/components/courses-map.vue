<template>
  <div>
    <ul>
      <li
        v-for="course in courses"
        :key="course.courseId"
        v-if="canReadCourse({ courseId: course.courseId })"
      >
        <router-link v-if="canUpdateCourse({ courseId: course.courseId })"
          :to="'/courses/' + course.courseSlug + '/edit'"
        >
          <button
            class="inline"
            :disabled="!isInstructorInCourse(course)"
            :title="titleForCourseEditButton(course)"
          >Edit</button>
        </router-link>
        <router-link
          :to="'/courses/' + course.courseSlug"
        >
          {{ course.courseSlug }}
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
      const currentUserId = store.state.users.currentUser.userId
      return course.instructors.some(user => user.userId === currentUserId)
    },
    titleForCourseEditButton (course) {
      return this.isInstructorInCourse(course)
        ? '' : 'Only instructors assigned to this course can edit it'
    }
  }
}
</script>
