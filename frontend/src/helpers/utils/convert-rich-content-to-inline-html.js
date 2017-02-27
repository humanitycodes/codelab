import { InlineCompiler } from 'rho'

export default text => {
  return new InlineCompiler({
    externalLinks: true
  }).toHtml(text)
}
