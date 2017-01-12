<template>
  <Layout>
    <h1>Code Reviews</h1>
    <CodeReviews :courses="courses"/>
  </Layout>
</template>

<script>
import Layout from '@layouts/main'
import CodeReviews from '@components/code-reviews'
import { courseGetters } from '@state/helpers'

export default {
  components: {
    Layout, CodeReviews
  },
  computed: courseGetters
}
</script>
