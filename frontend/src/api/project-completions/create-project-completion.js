import axios from 'axios'

export default async ({ courseId, lessonId }) => {
  return axios.post('/api/project-completions', { courseId, lessonId })
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.data
      }
      throw new Error(
        'Unexpected response received while creating project completion.'
      )
    })
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
