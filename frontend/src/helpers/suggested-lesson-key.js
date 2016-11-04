import { sortBy } from 'lodash'
import getCharacterDifference from './get-character-difference'

export default (lessonKey, lessons) => {
  const suggestedLesson = sortBy(
    lessons,
    lesson => getCharacterDifference(lessonKey, lesson['.key'])
  )[0]
  if (suggestedLesson) {
    return suggestedLesson['.key']
  }
}
