<template>
  <UserNav>
    <template slot="primary-list">
      <li v-if="isUserSignedIn">
        <router-link to="/courses">
          Courses
        </router-link>
      </li>
      <li v-if="canReadAllLessons()">
        <router-link to="/lessons">
          Lessons
        </router-link>
      </li>
    </template>
    <template slot="secondary-list">
      <li v-if="canReadAllCourses()">
        <router-link to="/code-reviews">
          Code Reviews
        </router-link>
      </li>
      <li v-if="canReadAllCourses()">
        <router-link to="/student-progress">
          Student Progress
        </router-link>
      </li>
    </template>
  </UserNav>
</template>

<script>
import {
  userGetters, userPermissionMethods, lessonPermissionMethods, coursePermissionMethods
} from '@state/helpers'
import UserNav from '@components/user-nav'

export default {
  components: {
    UserNav
  },
  computed: userGetters,
  methods: {
    ...userPermissionMethods,
    ...lessonPermissionMethods,
    ...coursePermissionMethods
  }
}
</script>
