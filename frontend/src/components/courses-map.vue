<template>
  <div>
    <ul>
      <li
        v-for="course in orderedCourses"
        :key="course.courseKey"
        v-if="canReadCourse({ courseKey: course.courseKey })"
      >
        <router-link v-if="canUpdateCourse({ courseKey: course.courseKey })"
          :to="'/courses/' + course.courseKey + '/edit'"
        >
          <button
            class="inline"
            :disabled="!isInstructorInCourse(course)"
            :title="titleForCourseEditButton(course)"
          >Edit</button>
        </router-link>
        <router-link
          :to="'/courses/' + course.courseKey"
        >
          {{ course.courseKey }}
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
import orderBy from 'lodash/orderBy'

export default {
  props: {
    courses: {
      type: Array,
      required: true
    }
  },
  computed: {
    orderedCourses () {
      return orderBy(this.courses, [course => course.courseKey])
    }
  },
  methods: {
    ...coursePermissionMethods,
    isInstructorInCourse (course) {
      const currentUserId = store.state.users.currentUser.userId
      return course.instructorIds.some(userId => userId === currentUserId)
    },
    titleForCourseEditButton (course) {
      return this.isInstructorInCourse(course)
        ? '' : 'Only instructors assigned to this course can edit it'
    }
  }
}
</script>
