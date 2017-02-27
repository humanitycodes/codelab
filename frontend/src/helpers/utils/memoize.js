export default fn => {
  return function () {
    const args = Array.prototype.slice.call(arguments)
    let hash = ''
    let i = args.length
    let currentArg = null
    while (i--) {
      currentArg = args[i]
      hash += (currentArg === Object(currentArg))
        ? JSON.stringify(currentArg)
        : currentArg
      if (!fn.memoize) {
        fn.memoize = {}
      }
    }
    if (!(hash in fn.memoize)) {
      fn.memoize[hash] = fn.apply(this, args)
    }
    return fn.memoize[hash]
  }
}
