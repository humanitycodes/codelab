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
    <div
      v-if="isExpanded && someoneElseIsEditing"
      class="rich-content-editor-someone-else-is-editing-warning"
    >
      <p class="warning">
        <strong>Warning!</strong> Someone else is currently editing this lesson. Simultaneous editing is <strong>not</strong> currently supported. This message will disappear when they are done.
      </p>
    </div>
  </div>
</template>

<script>
import throttle from 'lodash/throttle'
import 'codemirror/lib/codemirror.css'
import '@assets/css/codemirror-theme-one-dark.css'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/css/css'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/gfm/gfm'
import 'codemirror/keymap/sublime'
import 'codemirror/addon/search/search'
import 'codemirror/addon/search/searchcursor'
import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/dialog/dialog.css'
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
      contentToPreview: this.value,
      someoneElseIsEditing: false,
      someoneElseIsEditingTimeout: null
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
        keyMap: 'sublime',
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
      this.editor.on('change', throttle(editor => {
        this.$emit('input', editor.getValue())
      }, 3000))
      this.editor.on('focus', this.expandEditor)
    })
  },
  watch: {
    value (newValue, oldValue) {
      const { editor } = this
      if (editor.getValue() !== newValue) {
        const { left, top } = editor.getScrollInfo()
        editor.setValue(newValue)
        if (oldValue) {
          editor.scrollTo(left, top)
          editor.getInputField().blur()
          this.flashSomeoneElseIsEditingWarning()
        }
      }
      this.updateContentToPreview()
    }
  },
  methods: {
    updateContentToPreview: throttle(function (content) {
      this.contentToPreview = this.value
    }, 3000),
    expandEditor () {
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
    },
    flashSomeoneElseIsEditingWarning () {
      clearTimeout(this.someoneElseIsEditingTimeout)
      this.someoneElseIsEditing = true
      this.someoneElseIsEditingTimeout = setTimeout(() => {
        this.someoneElseIsEditing = false
      }, 5000)
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
    .cm-searching
      background-color: white
      color: black
    .CodeMirror-selected
      background-color: darkslategray

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
    .rich-content-editor-someone-else-is-editing-warning
      position: fixed
      top: 40%
      left: 0
      width: 100%
      z-index: 20
      .warning
        max-width: 80%
        margin: 0 auto
        box-shadow: 0 0 40px rgba(0,0,0,.4), 0 0 60px rgba(0,0,0,.4), 0 0 80px rgba(0,0,0,.4), 0 0 120px rgba(0,0,0,.4)
</style>
