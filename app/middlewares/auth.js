import jwt from 'jsonwebtoken'
import { refreshAccessAndRefreshToken } from "../services/refreshAccessAndRefreshToken.js"

export const authenticateToken = async (req, res, next) => {
  try {

    const accessToken = req.cookies?.accessToken
    
    if (accessToken) {
      try {

      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)
     
      req.user = decoded
      next()

      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          // do nothing we will try to refresh the token if refresh token is provided below
        } else {
          return res.status(401).json({ message: 'Invalid access token' })
        }
        }
    }
    
    const refreshToken = req.cookies?.refreshToken

    if (!accessToken ) {
      if (!refreshToken) return res.redirect('/login')
        console.log(`start refreshing token`)

      const refreshedData =await refreshAccessAndRefreshToken(refreshToken)

      if (!refreshedData) return res.redirect('/login')

      const { user, newAccessToken, newRefreshToken } = refreshedData

      if (!user || !newAccessToken || !newRefreshToken ) return res.status(401).json({ message: 'Cant refresh token' })

      res.cookie('accessToken', newAccessToken.token, {
        httpOnly: true,
        secure: true,
        maxAge: newAccessToken.maxAge,
        sameSite: 'strict'
      })

      res.cookie('refreshToken', newRefreshToken.token, {
            httpOnly: true,
            secure: true,
            maxAge: newRefreshToken.maxAge, 
            sameSite: 'strict'
        })

      req.user = user
      return next()
    }

  } catch (err) {
    next(err) 
  }
}