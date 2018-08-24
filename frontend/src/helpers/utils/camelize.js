// Swiped from Vue's shared/util, which sometimes moves around
export default str => str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
