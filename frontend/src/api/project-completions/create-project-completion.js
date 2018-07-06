import axios from 'axios'

export default async ({ courseId, lessonId }) => {
  return axios.post('/api/project-completions', { courseId, lessonId })
    .then(response => response.data)
    .catch(error => {
      console.log(
        `Error creating project completion`,
        `for course ${courseId}`,
        `and lesson ${lessonId}`,
        'Reason:', error
      )
      throw error
    })
}
