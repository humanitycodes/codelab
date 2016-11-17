import sortBy from 'lodash/sortBy'
import getCharacterDifference from './get-character-difference'

export default (resourceKey, resources) => {
  const suggestedResource = sortBy(
    resources,
    resource => getCharacterDifference(resourceKey, resource['.key'])
  )[0]
  if (suggestedResource) {
    return suggestedResource['.key']
  }
}
