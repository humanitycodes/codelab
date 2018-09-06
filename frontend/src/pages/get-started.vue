<template>
  <Layout>
    <header>
      <h1>Welcome</h1>
      <p>
        To have the best experience possible, please complete all of these
        tasks.
      </p>
    </header>
    <Box>
      <NotificationsForm/>
    </Box>
  </Layout>
</template>

<script>
import Layout from '@layouts/restricted'
import NotificationsForm from '@components/notifications-form'

export default {
  components: {
    Layout, NotificationsForm
  }
}
</script>
