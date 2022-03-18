<template>
  <section>
    <h2 class="mt-4 mb-2">All Instructors</h2>
    <table
      role="grid"
      class="dashboard-info"
      :aria-rowcount="orderedInstructors.length"
    >
      <thead>
        <th>Name</th>
        <th>Email</th>
      </thead>
      <tbody>
        <tr
          v-for="(instructor, index) in orderedInstructors"
          :key="index"
          :aria-rowindex="index + 1"
        >
          <td>{{ instructor.fullName }}</td>
          <td>
            <a
              target="_blank"
              :href="'mailto:' + instructor.email"
            >{{ instructor.email }}</a>
          </td>
        </tr>
      </tbody>
    </table>
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
      return orderBy(this.instructors, [
        instructor => instructor.fullName.toLowerCase(),
        instructor => instructor.email
      ])
    }
  }
}
</script>
