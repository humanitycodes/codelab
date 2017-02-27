<template>
  <div>
    The course <strong>{{ badKey }}</strong> doesn't exist. Did you mean
    <router-link :to="suggestedLink">{{ suggestedKey }}</router-link>?
  </div>
</template>

<script>
import getSuggestedKey from '@helpers/utils/get-suggested-key'
import { courseGetters } from '@state/helpers'

export default {
  computed: {
    ...courseGetters,
    badKey () {
      return this.$route.params.courseKey
    },
    suggestedKey () {
      return getSuggestedKey(
        this.badKey,
        this.courses.map(course => course['.key'])
      )
    },
    suggestedLink () {
      return this.$route.fullPath.replace(this.badKey, this.suggestedKey)
    }
  }
}
</script>
