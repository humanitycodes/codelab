import { sortBy } from 'lodash'
import getCharacterDifference from './get-character-difference'

export default function () {
  const key = this.lesson['.key']
  const suggestedLesson = sortBy(
    this.lessons,
    lesson => getCharacterDifference(key, lesson['.key'])
  )[0]
  if (suggestedLesson) {
    return suggestedLesson['.key']
  }
}
