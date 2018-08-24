module.exports = {
  root: true,
  extends: 'standard',
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  env: {
    node: true
  },
  // add your custom rules here
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 'off',
    // allow async-await
    'generator-star-spacing': 'off',
    'indent': [
      'error', 2, {
        // allow promise chains to line up on left side or be indented
        MemberExpression: 'off',
        // expect case conditions to be indented one level beyond switch
        SwitchCase: 1
      }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
