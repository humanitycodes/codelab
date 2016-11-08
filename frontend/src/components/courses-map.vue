<template>
  <div>
    <ul>
      <li v-for="course in courses">
        <router-link
          :to="'/courses/' + course['.key'] + '/edit'"
        ><button class="inline">Edit</button></router-link>
        <router-link
          :to="'/courses/' + course['.key']"
        >{{ course.title || course['.key'] }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    courses: {
      type: Array,
      required: true
    }
  }
}
</script>
