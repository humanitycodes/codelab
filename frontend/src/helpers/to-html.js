import { BlockCompiler } from 'rho'

export default text => {
  return new BlockCompiler({
    externalLinks: true
  }).toHtml(text)
}
