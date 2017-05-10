<template>
  <Layout>
    <h1>Users</h1>

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
              type="button"
              class="primary inline"
              @click="editUser(user)"
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
              <li v-for="securityRole in securityRoles">
                <label class="role-label">
                  <input type="checkbox" class="inline">
                    {{ securityRole }}
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
import Layout from '@layouts/main'
import Modal from '@components/modal'
import { userGetters } from '@state/helpers'
import sortBy from 'lodash/sortBy'
import securityRoles from '@constants/security-roles'

export default {
  components: {
    Layout, Modal
  },
  data () {
    return {
      showEditUserModal: false,
      editingUser: {},
      securityRoles
    }
  },
  computed: {
    ...userGetters,
    filteredUsers () {
      return sortBy(this.users, [
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
    githubRepoFor (user) {
      return `https://github.com/${user.github.login}`
    },
    userRoleNames (user) {
      const roles = this.roles.find(role => {
        return user['.key'] === role['.key']
      })
      let roleNames = []
      if (roles) {
        Object.keys(roles).forEach(roleName => {
          if (roleName !== '.key' && roles[roleName]) {
            roleNames.push(roleName)
          }
        })
      }
      return roleNames.length
        ? roleNames.sort().join(', ')
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
