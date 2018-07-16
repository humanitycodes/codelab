import jwt from 'jsonwebtoken'
import CODELAB_JWT_SECRET from '../../../env/jwt-secret'

export default ({ user }) => jwt.sign({ user }, CODELAB_JWT_SECRET)
