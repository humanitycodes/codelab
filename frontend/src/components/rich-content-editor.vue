<template>
  <div
    class="rich-content-editor-container"
    :class="{ expanded: isExpanded }"
  >
    <textarea
      ref="textarea"
      :name="name"
      :value.dom-prop="value"
    />
    <RenderedContent
      v-if="isExpanded"
      pagination-placement="top"
      :content="contentToPreview"
    />
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import 'codemirror/lib/codemirror.css'
import '@assets/css/codemirror-theme-one-dark.css'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/css/css'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/gfm/gfm'
import CodeMirror from 'codemirror/lib/codemirror.js'
import RenderedContent from './rendered-content'

export default {
  components: {
    RenderedContent
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    name: String
  },
  data () {
    return {
      editor: null,
      isExpanded: false,
      contentToPreview: this.value
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.editor = CodeMirror.fromTextArea(this.$refs.textarea, {
        mode: 'gfm',
        theme: 'one-dark',
        lineNumbers: false,
        tabSize: 2,
        lineWrapping: true,
        extraKeys: {
          Tab: editor => {
            var spaces = Array(editor.getOption('indentUnit') + 1).join(' ')
            editor.replaceSelection(spaces)
          },
          Esc: editor => {
            this.collapseEditor()
          }
        }
      })
      this.editor.setValue(this.value)
      this.editor.on('change', editor => {
        this.$emit('input', editor.getValue())
      })
      this.editor.on('focus', this.expandEditor)
    })
  },
  watch: {
    value (newValue) {
      if (this.editor.getValue() !== newValue) {
        this.editor.setValue(newValue)
      }
      this.updateContentToPreview()
    }
  },
  methods: {
    updateContentToPreview: debounce(function (content) {
      this.contentToPreview = this.value
    }, 300),
    expandEditor () {
      console.log(this.isExpanded)
      if (this.isExpanded) return
      this.isExpanded = true
      document.documentElement.style.overflowY = 'hidden'
      window.addEventListener('keydown', this.collapseEditorIfEscapeKey)
    },
    collapseEditor () {
      if (!this.isExpanded) return
      this.isExpanded = false
      document.documentElement.style.overflowY = 'auto'
      window.removeEventListener('keydown', this.collapseEditorIfEscapeKey)
      this.editor.getInputField().blur()
    },
    collapseEditorIfEscapeKey (event) {
      if (event.keyCode === 27) {
        this.collapseEditor()
      }
    }
  }
}
</script>

<style lang="stylus">
@import '../meta'

.rich-content-editor-container
  .CodeMirror
    border-radius: $design.control.border.radius
    pre
      font-size: 16px
      font-family: $design.code.font.family
    .CodeMirror-lines
      padding: $design.layout.gutterWidth

  &.expanded
    .CodeMirror, .rendered-content-container
      position: fixed
      top: 0
      width: 50%
      height: 100%
      border-radius: 0
      z-index: 10
    .CodeMirror
      left: 0
    .rendered-content-container
      right: 0
      background-color: #FFF
      padding: $design.layout.gutterWidth
      > .rendered-content
        flex-grow: 1
</style>
