<template>
  <div>
    <p v-if="!orderedCourses.length" class="pl-5 italic">
      This course list is empty.
    </p>
    <ul v-else>
      <li
        v-for="course in orderedCourses"
        :key="course.courseKey"
      >
        <router-link
          v-if="canUpdateCourse({ courseKey: course.courseKey })"
          :to="'/courses/' + course.courseKey + '/edit'"
        >
          <button
            class="inline"
            :disabled="!isInstructorInCourse(course)"
            :title="titleForCourseEditButton(course)"
          >Edit</button>
        </router-link>
        <router-link :to="'/courses/' + course.courseKey">
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
import { coursePermissionMethods, userGetters } from '@state/helpers'
import orderBy from 'lodash/orderBy'

export default {
  props: {
    courses: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...userGetters,
    orderedCourses () {
      return orderBy(this.courses, [course => course.courseKey])
    }
  },
  methods: {
    ...coursePermissionMethods,
    isInstructorInCourse (course) {
      return course.instructorIds.includes(this.currentUser.userId)
    },
    titleForCourseEditButton (course) {
      return this.isInstructorInCourse(course)
        ? ''
        : 'Only instructors assigned to this course can edit it'
    }
  }
}
</script>
