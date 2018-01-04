<template>
  <Layout>
    <h1>{{ title }}</h1>
    <div v-html="html"/>
  </Layout>
</template>

<script>
import Layout from '@layouts/main'
import content from '@assets/content/help.md'
import convertRichContentToHtml from '@helpers/utils/convert-rich-content-to-html'

export default {
  components: {
    Layout
  },
  data () {
    return {
      ...content.attributes,
      html: convertRichContentToHtml(content.body)
    }
  }
}
</script>
