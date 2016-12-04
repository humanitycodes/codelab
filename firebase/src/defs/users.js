import { nonEmpty } from '../generators/conditions'

export default {
  msuUid: {
    type: String,
    validate: nonEmpty
  },
  fullName: {
    type: String,
    validate: nonEmpty
  },
  email: {
    type: String,
    validate: nonEmpty
  },
  github: {
    fields: {
      login: String,
      scope: String,
      token: String,
      tokenType: String,
      userId: Number
    }
  }
}
