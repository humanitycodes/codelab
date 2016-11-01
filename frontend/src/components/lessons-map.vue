<template>
  <div>
    <ul>
      <li v-for="lesson in lessons">
        <router-link
          :to="'/lessons/' + lesson['.key'] + '/edit'"
        ><button class="inline">Edit</button></router-link>
        <router-link
          :to="'/lessons/' + lesson['.key']"
        >{{ lesson.title || lesson['.key'] }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    lessons: {
      type: Array,
      required: true
    }
  }
}
</script>
