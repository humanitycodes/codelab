import translateLearningObjectFromPayload from './learning-objective/from-payload'
import translateProjectCriterionFromPayload from './project-criterion/from-payload'

export default ({ payload }) => {
  // Whitelist fields that will be translated
  const lesson = {
    lessonId: payload.lessonId,
    lessonKey: payload.lessonKey,
    title: payload.title,
    estimatedHours: payload.estimatedHours,
    content: payload.content,
    notes: payload.notes,
    projectKey: payload.projectKey,
    projectTitle: payload.projectTitle,
    projectHosting: payload.projectHosting,
    version: payload.version,
    learningObjectives: [],
    projectCriteria: []
  }

  // Translate learning objectives
  if (payload.learningObjectives) {
    lesson.learningObjectives = payload.learningObjectives.map(
      learningObjectivePayload => translateLearningObjectFromPayload({
        payload: learningObjectivePayload
      })
    )
  }

  // Translate project criterion
  if (payload.projectCriteria) {
    lesson.projectCriteria = payload.projectCriteria.map(
      projectCriterionPayload => translateProjectCriterionFromPayload({
        payload: projectCriterionPayload
      })
    )
  }

  return lesson
}
