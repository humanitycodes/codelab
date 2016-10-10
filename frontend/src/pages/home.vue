<template>
  <Layout>
    <h1>Hi.</h1>
    <TodoList/>
  </Layout>
</template>

<script>
import Layout from '@layouts/main'

// COMPONENTS
import TodoList from '@components/todo-list'

export default {
  components: {
    Layout, TodoList
  }
}
</script>
