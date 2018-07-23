import translateLearningObjectiveFromRecord from './learning-objective/from-record'
import translateProjectCriterionFromRecord from './project-criterion/from-record'
import canReadAllLessons from 'helpers/permission/can-read-all-lessons'

export default ({ authUser, lessonRecord }) => {
  // Whitelist of fields that are available to clients
  let lesson = {
    lessonId: lessonRecord.lessonId,
    lessonKey: lessonRecord.lessonKey,
    title: lessonRecord.title,
    estimatedHours: lessonRecord.estimatedHours,
    content: lessonRecord.content,
    projectKey: lessonRecord.projectKey,
    projectTitle: lessonRecord.projectTitle,
    projectHosting: lessonRecord.projectHosting,
    version: lessonRecord.version,
    learningObjectives: [],
    projectCriteria: [],
    prerequisiteLessonIds: []
  }

  // Students cannot see lesson notes
  if (canReadAllLessons(authUser)) {
    lesson.notes = lessonRecord.notes
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

  // Translate courses (IDs only)
  if (lessonRecord.courses) {
    lesson.courseIds = lessonRecord.courses.map(
      courseRecord => courseRecord.courseId
    )
  }

  return lesson
}
