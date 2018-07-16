import jwt from 'jsonwebtoken'
import CODELAB_JWT_SECRET from '../../../env/jwt-secret'

export default token => jwt.verify(token, CODELAB_JWT_SECRET)
