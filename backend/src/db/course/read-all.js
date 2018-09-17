import Course from './index'
import largeCourseFields from './large-fields'

export default options => Course.findAll({
  ...options,
  attributes: {
    exclude: largeCourseFields
  }
})
