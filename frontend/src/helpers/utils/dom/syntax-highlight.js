import hljs from 'highlight.js/lib/highlight'

import bash from 'highlight.js/lib/languages/bash'
import xml from 'highlight.js/lib/languages/xml'
import javascript from 'highlight.js/lib/languages/javascript'
import scss from 'highlight.js/lib/languages/scss'
import sql from 'highlight.js/lib/languages/sql'

export const codeLangs = {
  css: scss,
  scss: scss,
  js: javascript,
  json: javascript,
  javascript: javascript,
  ejs: xml,
  html: xml,
  sh: bash,
  sql: sql,
  ddl: sql
}

export const codeExtensions = Object.keys(codeLangs)

codeExtensions.forEach(extension => {
  hljs.registerLanguage(extension, codeLangs[extension])
})

export const highlight = hljs.highlight
export const highlightAuto = hljs.highlightAuto
