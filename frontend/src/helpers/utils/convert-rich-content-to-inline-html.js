const InlineCompiler = require('rho').InlineCompiler

export default text => {
  return new InlineCompiler({
    externalLinks: true
  }).toHtml(text)
}
