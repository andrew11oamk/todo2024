import jwt from 'jsonwebtoken'
const { verify } = jwt

const auth = (req, res, next) => {
  const authorizationRequired = 'Authorization required'
  const invalidCredentials = 'Invalid credentials'

  if (!req.headers.authorization) {
    res.statusMessage = authorizationRequired
    res.status(401).json({ message: authorizationRequired })
  } else {
    try {
      const token = req.headers.authorization
      verify(token, process.env.JWT_SECRET_KEY)
      next()
    } catch (err) {
      res.statusMessage = invalidCredentials
      res.status(403).json({ message: invalidCredentials })
    }
  }
}

export { auth }
