<template>
  <Layout>
    <pre v-if="lesson.createdBy">{{ lesson }}</pre>
    <div v-if="!lesson.createdBy && lesson['.key']">
      The lesson <strong>{{ $route.params.key }}</strong> doesn't exist. Did you mean
      <router-link
        :to="'/lessons/' + suggestedKey"
      >{{ suggestedKey }}</router-link>?
    </div>
  </Layout>
</template>

<script>
import Layout from '@layouts/main'
import db from '@plugins/firebase'
import suggestedKey from '@helpers/suggested-lesson-key'
import store from '@state/store'

export default {
  beforeRouteEnter (to, from, next) {
    if (store.getters.userIsInstructor || store.getters.userIsAdmin) {
      next()
    } else {
      next('/')
    }
  },
  components: {
    Layout
  },
  firebase () {
    return {
      lessons: db.ref('lessons'),
      lesson: {
        source: db.ref('lessons').child(this.$route.params.key),
        asObject: true
      }
    }
  },
  computed: {
    suggestedKey
  }
}
</script>
