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
            >
              Edit
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </Layout>
</template>

<script>
import Layout from '@layouts/main'
import { userGetters } from '@state/helpers'
import sortBy from 'lodash/sortBy'

export default {
  components: {
    Layout
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
