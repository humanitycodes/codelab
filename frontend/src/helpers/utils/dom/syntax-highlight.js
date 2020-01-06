import hljs from 'highlight.js/lib/highlight'

import bash from 'highlight.js/lib/languages/bash'
import xml from 'highlight.js/lib/languages/xml'
import javascript from 'highlight.js/lib/languages/javascript'
import scss from 'highlight.js/lib/languages/scss'
import pgsql from './highlight-pgsql'
import markdown from 'highlight.js/lib/languages/markdown'

export const codeLangs = {
  css: scss,
  scss: scss,
  js: javascript,
  json: javascript,
  javascript: javascript,
  jsx: javascript,
  ejs: xml,
  html: xml,
  sh: bash,
  sql: pgsql,
  ddl: pgsql,
  md: markdown,
  markdown: markdown
}

export const codeExtensions = Object.keys(codeLangs)

codeExtensions.forEach(extension => {
  hljs.registerLanguage(extension, codeLangs[extension])
})

export const highlight = hljs.highlight
export const highlightAuto = hljs.highlightAuto
