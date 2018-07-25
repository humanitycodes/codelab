import translateLearningObjectiveFromRecord from './learning-objective/from-record'
import translateProjectCriterionFromRecord from './project-criterion/from-record'
import canReadAllLessons from 'helpers/permission/can-read-all-lessons'

export default async ({ authUser, lessonRecord, transaction }) => {
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
  const learningObjectives = await lessonRecord.getLearningObjectives({
    transaction
  })
  lesson.learningObjectives = learningObjectives.map(
    lessonLearningObjectiveRecord =>
      translateLearningObjectiveFromRecord({ lessonLearningObjectiveRecord })
  )

  // Translate project criteria
  const projectCriteria = await lessonRecord.getProjectCriteria({ transaction })
  lesson.projectCriteria = projectCriteria.map(
    lessonProjectCriterionRecord =>
      translateProjectCriterionFromRecord({ lessonProjectCriterionRecord })
  )

  // Translate prerequisite lessons (IDs only)
  const prerequisiteLessons = await lessonRecord.getPrerequisiteLessons({
    attributes: ['lessonId'], transaction
  })
  lesson.prerequisiteLessonIds = prerequisiteLessons.map(
    prerequisiteLessonRecord => prerequisiteLessonRecord.lessonId
  )

  // Translate courses (IDs only)
  const courses = await lessonRecord.getCourses({
    attributes: ['courseId'], transaction
  })
  lesson.courseIds = courses.map(courseRecord => courseRecord.courseId)

  return lesson
}
