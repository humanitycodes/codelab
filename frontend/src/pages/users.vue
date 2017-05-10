<template>
  <Layout>
    <h1>Users</h1>

    <label>Search</label>
    <input
      type="text"
      name="search-text"
      v-model="searchText"
      placeholder="e.g. name, email"
    ></input>

    <table class="dashboard-info">
      <thead>
        <th>Name</th>
        <th>Email</th>
        <th>Roles</th>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers">
          <td class="user-name">
            <a
              v-if="user.github"
              :href="githubRepoFor(user)"
              target="_blank"
            >{{ user.fullName }}</a>
            <span v-else>
              {{ user.fullName }}
            </span>
          </td>
          <td class="user-email">
            <a
              :href="`mailto:${user.email}`"
              target="_blank"
            >{{ user.email }}</a>
          </td>
          <td class="role-list">
            {{ userRoleNames(user) }}
          </td>
          <td class="role-actions">
            <button
              v-if="user['.key'] !== currentUser.uid"
              type="button"
              class="primary inline"
              @click="editUser(user)"
            >
              Edit
            </button>
            <button
              v-else
              disabled
              type="button"
              class="primary inline"
              title="Editing your own roles is currently not permitted"
            >
              Edit
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <Modal :show="showEditUserModal" @close="onCloseEditUserModal">
      <main>
        <div class="flex-row">
          <div class="flex-col">
            <label>Name</label>
            <div>{{ editingUser.fullName }}</div>
          </div>
        </div>
        <div class="flex-row">
          <div class="flex-col">
            <label>Email</label>
            <div>{{ editingUser.email }}</div>
          </div>
        </div>
        <div class="flex-row">
          <div class="flex-col">
            <label>Roles</label>
            <ul>
              <li v-for="roleName in roleNames">
                <label class="role-label">
                  <input
                    type="checkbox"
                    class="inline"
                    :checked="userHasRole(roleName)"
                    @change="onChangeUserRole(roleName, $event)"
                  >
                    {{ roleName }}
                  </input>
                </label>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <footer>
        <button
          name="done-button"
          class="primary"
          @click="onCloseEditUserModal"
        >
          Done
        </button>
      </footer>
    </Modal>
  </Layout>
</template>

<script>
import store from '@state/store'
import Layout from '@layouts/main'
import Modal from '@components/modal'
import { userGetters, roleGetters } from '@state/helpers'
import sortBy from 'lodash/sortBy'
import roleNames from '@src/../../firebase/dist/defs/roles'

export default {
  components: {
    Layout, Modal
  },
  data () {
    return {
      searchText: '',
      showEditUserModal: false,
      editingUser: {},
      roleNames
    }
  },
  computed: {
    ...userGetters,
    ...roleGetters,
    filteredUsers () {
      const regex = new RegExp(this.searchText, 'gi')
      const filteredUsers = this.users.filter(user => {
        return user.fullName.search(regex) !== -1 ||
          user.email.search(regex) !== -1
      })
      return sortBy(filteredUsers, [
        user => this.userRoleNames(user),
        'fullName'
      ])
    }
  },
  methods: {
    editUser (user) {
      this.editingUser = user
      this.showEditUserModal = true
    },
    onCloseEditUserModal () {
      this.showEditUserModal = false
    },
    onChangeUserRole (roleName, event) {
      const roles = this.userRoles(this.editingUser)
      if (roles) {
        store.dispatch('updateUserRole', {
          userKey: this.editingUser['.key'],
          roleName,
          enabled: event.target.checked
        })
      }
    },
    githubRepoFor (user) {
      return `https://github.com/${user.github.login}`
    },
    userRoles (user) {
      return this.roles.find(role => {
        return user['.key'] === role['.key']
      })
    },
    userHasRole (roleName) {
      const roles = this.userRoles(this.editingUser) || {}
      return !!roles[roleName]
    },
    userRoleNames (user) {
      const roles = this.userRoles(user)
      let setRoleNames = []
      if (roles) {
        Object.keys(roles).forEach(roleName => {
          if (roleName !== '.key' && roles[roleName]) {
            setRoleNames.push(roleName)
          }
        })
      }
      return setRoleNames.length
        ? setRoleNames.sort().join(', ')
        : 'none'
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../meta'

ul
  list-style-type: none
  margin-top: 0
  padding-left: $design.layout.gutterWidth

label.role-label
  font-weight: normal

input[type=checkbox]
  margin-right: $design.control.padding.horizontal*0.5

.user-name
.user-email
  white-space: nowrap

.role-list
  text-align: right

.role-actions
  width: 1px
  border: none
  padding: 0 inherit
</style>
