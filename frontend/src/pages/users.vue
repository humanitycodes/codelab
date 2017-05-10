<template>
  <Layout>
    <h1>Users</h1>

    <table class="dashboard-info">
      <thead>
        <th>Name</th>
        <th>Roles</th>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers">
          <td>
            <a
              :href="`mailto:${user.email}`"
              target="_blank"
            >{{ user.fullName }}</a>
          </td>
          <td class="role-list">
            {{ userRoleNames(user) }}
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
      if (roleNames.length) {
        return roleNames.sort().join(', ')
      } else {
        return 'none'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../meta'

td.role-list
  text-align: right
</style>
