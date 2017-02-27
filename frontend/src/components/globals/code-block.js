import { highlight, highlightAuto } from '@helpers/utils/dom/syntax-highlight'

export default {
  render (h) {
    const children = this.$slots.default
    const html = children.map(vnode => {
      // Normalize indention
      const indentionMatch = vnode.text.match(/^\s*?\n( +)/)
      if (indentionMatch) {
        const indention = indentionMatch[1].length
        vnode.text = vnode.text.replace(
          new RegExp(`\\n {${indention}}`, 'g'),
          '\n'
        )
      }
      // Trim whitespace at edges
      vnode.text = vnode.text.trim()
      return this.lang
        ? highlight(this.lang, vnode.text).value
        : highlightAuto(vnode.text).value
    }).join('')
    return <pre class={{ [this.lang]: !!this.lang }}><code
      class={{
        hljs: true,
        [this.lang]: !!this.lang
      }}
      domPropsInnerHTML={ html }
    ></code></pre>
  },
  props: {
    lang: String
  }
}
