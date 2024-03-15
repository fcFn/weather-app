import type { Request, Response } from "express"
import { redis } from "./index.js"
// TODO: Can this be a middleware?
export function createCachedHandler(
  redisKey: string,
  url: string | ((query: string) => string),
  transformResponse?: (result: any) => any,
) {
  return async (req: Request, res: Response) => {
    const query = (req.query.q as string).toLowerCase()
    if (query === "" || typeof query !== "string") {
      return res.status(400).json({ message: "Missing query" })
    }
    const cached = await redis.hGet(redisKey, query)
    let result
    if (!cached) {
      const response = await (await fetch(typeof url === "function" ? url(query) : url)).json()
      result = response
      if (transformResponse) {
        result = transformResponse(result)
      }
      await redis.hSet(redisKey, query, JSON.stringify(result))
      setRedisKeyExpiry()
    } else {
      result = JSON.parse(cached)
    }
    return res.json(result)
  }
}

export async function setRedisKeyExpiry() {
  // Expire the cache after 24 hours
  // (except location and city search suggestions that are cached forever)
  // Redis version on Render is <7 and doesn't have EXPIRETIME so we have to
  // keep a flag ourselves to prevent resetting the timer
  if (!(await redis.hGet("current", "expirySet"))) {
    await redis.expire("current", 60 * 60 * 24)
    await redis.hSet("current", "expirySet", "1")
  }
  if (!(await redis.hGet("forecast", "expirySet"))) {
    await redis.expire("forecast", 60 * 60 * 24)
    await redis.hSet("forecast", "expirySet", "1")
  }
}
