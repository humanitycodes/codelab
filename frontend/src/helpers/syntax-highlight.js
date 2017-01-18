import hljs from 'highlight.js/lib/highlight'

import bash from 'highlight.js/lib/languages/bash'
import xml from 'highlight.js/lib/languages/xml'
import javascript from 'highlight.js/lib/languages/javascript'
import scss from 'highlight.js/lib/languages/scss'

hljs.registerLanguage('sh', bash)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('css', scss)
hljs.registerLanguage('scss', scss)

export const highlight = hljs.highlight
export const highlightAuto = hljs.highlightAuto
