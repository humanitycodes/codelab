const operatorJoin = (expressions, operator) => {
  const truthyExpressions = expressions.filter(p => p)
  if (truthyExpressions.length === 1) return truthyExpressions.join('')
  const text = truthyExpressions.join(` ${operator} `)
  return text && truthyExpressions.length > 0 ? '(' + text + ')' : text
}

// ---------
// OPERATORS
// ---------

export const all = (...expressions) => {
  return operatorJoin(expressions, '&&')
}
export const any = (...expressions) => {
  return operatorJoin(expressions, '||')
}
export const not = expression => {
  return '!' + expression
}

// -------------
// SIMPLE CHECKS
// -------------

export const keyInResource = (key, resource) => {
  if (!['users', 'roles'].includes(resource)) {
    resource = `${resource}/meta`
  }
  return `root.child('${resource}/'+${key}).exists()`
}
export const keyIsCurrentUser = key => {
  return `auth.uid === ${key}`
}
export const isGreaterThan = min => {
  return `newData.val() > ${min}`
}
export const isLongerThan = min => {
  return `newData.val().length > ${min}`
}
export const isOneOfTheseStrings = (...array) => {
  return any(
    ...array.map(value => {
      return `newData.val() === '${value}'`
    })
  )
}
export const nonEmpty = isLongerThan(0)
export const childIsFalsy = child => {
  return any(
    `!newData.child('${child}').exists()`,
    `newData.child('${child}').val() === false`
  )
}
export const hasRole = role => {
  return `root.child('roles/'+auth.uid+'/${role}').val() === true`
}
export const userSignedIn = 'auth !== null'
export const noOtherFields = {
  $other: { '.validate': false }
}

// ----------
// TYPE CHECK
// ----------

const isInteger = data => {
  return exports.all(
    `${data}.isNumber()`,
    `${data}.val() % 1 === 0`
  )
}

const validateType = (type, data = 'newData') => {
  return {
    [Boolean]: `${data}.isBoolean()`,
    [String]: `${data}.isString()`,
    [Number]: `${data}.isNumber()`,
    [Date]: isInteger(data),
    Integer: isInteger(data)
  }[type]
}

export const isType = (type, data) => {
  const validation = validateType(type, data)
  if (!validation) throw new Error('Bad type passed to isType')
  return validation
}
