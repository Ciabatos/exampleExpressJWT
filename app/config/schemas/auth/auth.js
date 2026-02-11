import { query } from "../../postgresMainDatabase.js"

export async function getRefreshToken(id) {
  try {

    const result = await query(
       `SELECT * FROM auth.get_refresh_token($1)`
      ,[id]
    )

    if (!result.rows || result.rows.length === 0) {
    return null
    }

    return result.rows[0]
  } catch (error) {
    console.error(`Error getting refresh token for user ${id}:`, error)
    throw new Error("Failed to get refresh token")
  }
}

export async function insertRefreshToken(id, token, expiresAt , ip, userAgent) {
  try {

    const result = await query(
       `SELECT * FROM auth.insert_refresh_token($1, $2, $3, $4, $5)`
      ,[id, token, expiresAt, ip, userAgent]
    )

    if (!result.rows || result.rows.length === 0) {
    return null
    }

    return result.rows[0]
  } catch (error) {
    console.error(`Error inserting refresh token for user ${id}:`, error)
    throw new Error("Failed to insert refresh token")
  }
}

export async function revokeRefreshToken(id, ip, userAgent) {
  try {

    const result = await query(
       `SELECT * FROM auth.revoke_refresh_token($1, $2, $3)`
      ,[id, ip, userAgent]
    )

    if (!result.rows || result.rows.length === 0) {
    return null
    }

    return result.rows[0]
  } catch (error) {
    console.error(`Error revoking refresh token for user ${id}:`, error)
    throw new Error("Failed to revoke refresh token")
  }
}


export async function getUser(email) {
  try {
    const result = await query(
       `SELECT * FROM auth.login($1)`
      ,[email]
    )

    if (!result.rows || result.rows.length === 0) {
    return null
    }

    return result.rows[0]
  } catch (error) {
    console.error(`Error fetching user ${email}:`, error)
    throw new Error("Failed to fetch user")
  }
}

export async function registerNewUser(name, email, password) {
  try {
    const result = await query(
       `SELECT * FROM auth.register_new_user($1, $2, $3)`
      ,[name, email, password]
    )

    if (!result.rows || result.rows.length === 0) {
    return null
    }

    return result.rows[0]
  } catch (error) {
    console.error(`Error registering new user ${name}:`, error)
    throw new Error("Failed to register new user")
  }
}