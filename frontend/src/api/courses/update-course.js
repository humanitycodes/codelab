import axios from 'axios'

export default async course => {
  return axios.put(`/api/courses/${course.courseId}`, course)
    .then(response => response.data)
    .catch(error => {
      console.log(
        `Error updating course ${course.courseId}.`,
        'Reason:', error
      )
      throw error
    })
}
