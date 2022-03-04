<template>
  <Layout>
    <h1>Instructors</h1>
    <router-link class="block" v-if="canCreateInstructor()" to="/instructors/new">New Instructor</router-link>
    <InstructorsList :instructors="instructors"/>
  </Layout>
</template>

<script>
import Layout from '@layouts/main'
import InstructorsList from '@components/instructors-list'
import { userGetters, userPermissionMethods } from '@state/helpers'

export default {
  components: {
    Layout, InstructorsList
  },
  computed: {
    ...userGetters,
    instructors () {
      return this.users.filter(user => user.isInstructor)
    }
  },
  methods: {
    ...userPermissionMethods
  }
}
</script>
