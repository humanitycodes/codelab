<template>
  <section>
    <h2 class="mt-4 mb-2">All Instructors</h2>
    <ul>
      <li
        v-for="instructor in orderedInstructors"
        :key="instructor.userId"
      >
          <a
            :name="'instructor-' + instructor.email"
            :href="'mailto:' + instructor.email"
            target="_blank"
          >{{ instructor.email }}</a>
        ({{ instructor.fullName }})
      </li>
    </ul>
  </section>
</template>

<script>
import orderBy from 'lodash/orderBy'

export default {
  props: {
    instructors: {
      type: Array,
      required: true
    }
  },
  computed: {
    orderedInstructors () {
      return orderBy(this.instructors, [instructor => instructor.email])
    }
  }
}
</script>
