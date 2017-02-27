// Levenshtein Distance
export default (a, b) => {
  var m = []
  if (!(a && b)) return (b || a).length
  for (let i = 0; i <= b.length; m[i] = [i++]) {}
  for (let j = 0; j <= a.length; m[0][j] = j++) {}
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      m[i][j] = b.charAt(i - 1) === a.charAt(j - 1)
        ? m[i - 1][j - 1]
        : m[i][j] = Math.min(
          m[i - 1][j - 1] + 1,
          Math.min(m[i][j - 1] + 1, m[i - 1][j] + 1))
    }
  }
  return m[b.length][a.length]
}
