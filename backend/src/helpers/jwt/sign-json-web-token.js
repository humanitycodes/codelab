import jwt from 'jsonwebtoken'
import jwtSecret from '../../../env/jwt-secret'

export default ({ user }) => jwt.sign({ user }, jwtSecret)
