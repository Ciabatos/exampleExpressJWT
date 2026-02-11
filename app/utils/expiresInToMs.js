export function expiresInToMs(value) {
  const match = value.match(/^(\d+)([smhd])$/)

  if (!match) {
    throw new Error("Invalid expires format, use e.g. 15m, 10s, 1h, 2d")
  }

  const amount = Number(match[1])
  const unit = match[2]

  switch (unit) {
    case "s": return amount * 1000
    case "m": return amount * 60 * 1000
    case "h": return amount * 60 * 60 * 1000
    case "d": return amount * 24 * 60 * 60 * 1000
  }
}