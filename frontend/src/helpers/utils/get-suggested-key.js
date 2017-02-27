import sortBy from 'lodash/sortBy'
import getCharacterDifference from './get-character-difference'

export default (attemptedKey, possibleKeys) => {
  const suggestedKey = sortBy(
    possibleKeys,
    possibleKey => getCharacterDifference(attemptedKey, possibleKey)
  )[0]
  return suggestedKey
}
