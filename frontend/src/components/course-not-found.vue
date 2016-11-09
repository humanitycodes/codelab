<template>
  <div>
    The course <strong>{{ badKey }}</strong> doesn't exist. Did you mean
    <router-link :to="suggestedLink">{{ suggestedKey }}</router-link>?
  </div>
</template>

<script>
import suggestedCourseKey from '@helpers/suggested-resource-key'
import { courseGetters } from '@state/helpers'

export default {
  computed: {
    ...courseGetters,
    badKey () {
      return this.$route.params.courseKey
    },
    suggestedKey () {
      return suggestedCourseKey(this.badKey, this.courses)
    },
    suggestedLink () {
      return this.$route.fullPath.replace(this.badKey, this.suggestedKey)
    }
  }
}
</script>
