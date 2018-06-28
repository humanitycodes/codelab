import translateLearningObjectiveFromRecord from './learning-objective/from-record'
import translateProjectCriterionFromRecord from './project-criterion/from-record'

export default ({ lessonRecord }) => {
  // Whitelist of fields that are available to clients
  let lesson = {
    lessonId: lessonRecord.lessonId,
    lessonKey: lessonRecord.lessonKey,
    title: lessonRecord.title,
    estimatedHours: lessonRecord.estimatedHours,
    content: lessonRecord.content,
    notes: lessonRecord.notes,
    projectTitle: lessonRecord.projectTitle,
    projectHosting: lessonRecord.projectHosting,
    learningObjectives: [],
    projectCriteria: [],
    prerequisiteLessonIds: [],
    postrequisiteLessonIds: []
  }

  // Translate learning objectives
  if (lessonRecord.learningObjectives) {
    lesson.learningObjectives = lessonRecord.learningObjectives.map(
      lessonLearningObjectiveRecord => translateLearningObjectiveFromRecord({
        lessonLearningObjectiveRecord
      })
    )
  }

  // Translate project criteria
  if (lessonRecord.projectCriteria) {
    lesson.projectCriteria = lessonRecord.projectCriteria.map(
      lessonProjectCriterionRecord => translateProjectCriterionFromRecord({
        lessonProjectCriterionRecord
      })
    )
  }

  // Translate prerequisite lessons (IDs only)
  if (lessonRecord.prerequisiteLessons) {
    lesson.prerequisiteLessonIds = lessonRecord.prerequisiteLessons.map(
      prerequisiteLessonRecord => prerequisiteLessonRecord.lessonId
    )
  }

  // Translate postrequisite lessons (IDs only)
  if (lessonRecord.postrequisiteLessons) {
    lesson.postrequisiteLessonIds = lessonRecord.postrequisiteLessons.map(
      postrequisiteLessonRecord => postrequisiteLessonRecord.lessonId
    )
  }

  // Translate courses (IDs only)
  if (lessonRecord.courses) {
    lesson.courseIds = lessonRecord.courses.map(
      courseRecord => courseRecord.courseId
    )
  }

  return lesson
}
