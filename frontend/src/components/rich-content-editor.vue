<template>
  <div
    class="rich-content-editor-container"
    :class="{ expanded: isExpanded }"
  >
    <textarea
      ref="textarea"
      :id="id"
      :name="name"
      :value.dom-prop="value"
    />
    <RenderedContent
      v-if="isExpanded"
      pagination-placement="top"
      no-content-message="Start writing some content and you'll see a preview here!"
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
import debounce from 'lodash/debounce'
import 'codemirror/lib/codemirror.css'
import '@assets/css/codemirror-theme-one-dark.css'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/css/css'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/gfm/gfm'
import 'codemirror/keymap/sublime'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/search/search'
import 'codemirror/addon/search/searchcursor'
import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/dialog/dialog.css'
import CodeMirror from 'codemirror/lib/codemirror.js'
import CodeMirrorSpellChecker from 'codemirror-spell-checker'
import RenderedContent from './rendered-content'

CodeMirrorSpellChecker({
  codeMirrorInstance: CodeMirror
})

export default {
  components: {
    RenderedContent
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    id: String,
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
        mode: 'spell-checker',
        backdrop: 'gfm',
        theme: 'one-dark',
        lineNumbers: false,
        tabSize: 2,
        lineWrapping: true,
        styleActiveLine: true,
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
      }, 450))
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
    updateContentToPreview: debounce(function (content) {
      this.contentToPreview = this.value
    }, 1000),
    expandEditor () {
      if (this.isExpanded) return
      this.isExpanded = true
      document.documentElement.style.overflowY = 'hidden'
      window.addEventListener('keydown', this.collapseEditorIfEscapeKey)
      this.$nextTick(() => {
        this.editor.refresh()
      })
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
    .cm-comment
      color: #f9cc9d
    .cm-header
      color: #e5868e
    .cm-searching
      background-color: white
      color: black
    .CodeMirror-selected
      background-color: darkslategray
    .cm-spell-error:not(.cm-comment)
      border-bottom: 1px solid #55296b
      transition: border-bottom 1s ease-in-out
    .CodeMirror-activeline .cm-spell-error:not(.cm-comment)
      border-bottom: 1px dotted #b3436c
    .CodeMirror-linebackground
      background-color: transparent

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
      background-color: #fff
      padding: $design.layout.gutterWidth
      overflow-y: auto
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
