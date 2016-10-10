import Vue from 'vue'
import TodoList from '@components/todo-list'

describe('todo-list.vue', () => {
  it('renders a list item for each todo', () => {
    const vm = new Vue(TodoList).$mount()
    expect(vm.$el.querySelectorAll('li').length)
      .to.equal(vm.todos.length)
  })

  it('correctly adds a todo', done => {
    const vm = new Vue(TodoList).$mount()
    const origTodosCount = vm.$el.querySelectorAll('li').length
    vm.newTodoText = 'hello'
    vm.addTodo()
    expect(vm.newTodoText).to.equal('')
    expect(vm.todos[vm.todos.length - 1].text).to.equal('hello')
    Vue.nextTick(() => {
      const newTodosCount = vm.$el.querySelectorAll('li').length
      expect(newTodosCount).to.equal(origTodosCount + 1)
      done()
    })
  })

  it('correctly removes a todo', done => {
    const vm = new Vue(TodoList).$mount()
    vm.newTodoText = 'foo'
    vm.addTodo()
    vm.newTodoText = 'bar'
    vm.addTodo()
    Vue.nextTick(() => {
      const origSecondTodo = vm.todos[1]
      const origTodosCount = vm.$el.querySelectorAll('li').length
      vm.removeTodo(vm.todos[0])
      expect(vm.todos[0]).to.equal(origSecondTodo)
      Vue.nextTick(() => {
        const newTodosCount = vm.$el.querySelectorAll('li').length
        expect(newTodosCount).to.equal(origTodosCount - 1)
        done()
      })
    })
  })
})
