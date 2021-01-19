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
        <router-link :to="courseReportPath(course)">
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
    courseReportPath (course) {
      return `/courses/${course.courseKey}/reports/progress`
    }
  }
}
</script>
