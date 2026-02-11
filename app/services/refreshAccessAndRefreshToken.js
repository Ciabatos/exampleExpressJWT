
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getRefreshToken, insertRefreshToken, revokeRefreshToken } from '../config/schemas/auth/auth.js';
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";

export async function refreshAccessAndRefreshToken(refreshToken) {
  
  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET
  )
  
  const userFromDb = await getRefreshToken(decoded.id)

  if ( !userFromDb || !await bcrypt.compare(refreshToken, userFromDb.tokenHash)) {
         console.log(`Invalid refresh token for user`)
        return null
     }
 
  const payload = {
    id: userFromDb.userId,
    email: userFromDb.email,
    name: userFromDb.name
  }

 const newAccessToken = generateAccessToken(payload)
 const newRefreshToken = generateRefreshToken(payload)

 const hashednewRefreshToken = await bcrypt.hash(newRefreshToken.token, 10);
  await revokeRefreshToken(userFromDb.userId, userFromDb.ip, userFromDb.userAgent)
  await insertRefreshToken(userFromDb.userId, hashednewRefreshToken, newRefreshToken.expiresAt,  userFromDb.ip , userFromDb.userAgent);

  return {
    user: payload,
    newAccessToken: newAccessToken,
    newRefreshToken: newRefreshToken
  }
}
