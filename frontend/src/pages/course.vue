<template>
  <Layout>
    <pre v-if="currentCourse">{{ currentCourse }}</pre>
  </Layout>
</template>

<script>
import Layout from '@layouts/main'
import { courseGetters } from '@state/helpers'

export default {
  components: {
    Layout
  },
  computed: courseGetters
}
</script>
