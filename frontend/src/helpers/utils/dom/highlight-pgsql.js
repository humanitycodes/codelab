import sqlHighlighter from 'highlight.js/lib/languages/sql'

export default hljs => {
  const sql = sqlHighlighter(hljs)
  if (!sql || !sql.contains) return

  // Add/remove custom keywords
  sql.contains.forEach(mode => {
    if (!mode.keywords || !mode.keywords.keyword) return

    const { keyword } = mode.keywords
    mode.keywords.keyword = keyword
      .replace(/ (id|name) /g, ' ')
      .concat(' primary')
  })

  return sql
}
