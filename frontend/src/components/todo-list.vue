<template>
  <div>
    <input
      v-model.trim="newTodoText"
      @keyup.enter="addTodo"
      placeholder="Add new todo"
    >
    <ul>
      <li v-for="todo in todos">
        {{ todo.text }}
        <button @click="removeTodo(todo)">X</button>
      </li>
    </ul>
  </div>
</template>

<script>
// DB
import db from '@plugins/firebase'
const todosRef = db.ref('todos')

export default {
  data () {
    return {
      newTodoText: ''
    }
  },
  firebase: {
    todos: todosRef
  },
  methods: {
    addTodo () {
      if (this.newTodoText) {
        todosRef.push({
          text: this.newTodoText
        })
        this.newTodoText = ''
      }
    },
    removeTodo (todo) {
      todosRef.child(todo['.key']).remove()
    }
  }
}
</script>

<style scoped>
h1 {
  color: #42b983;
}
</style>
