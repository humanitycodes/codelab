import jwt from 'jsonwebtoken'
import jwtSecret from '../../../env/jwt-secret'

export default token => jwt.verify(token, jwtSecret)
