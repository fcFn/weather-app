import type { Request, Response } from "express";
import { redis } from "./index.js";
// TODO: Can this be a middleware?
export function createCachedHandler(
  redisKey: string,
  url: string | ((query: string) => string),
  transformResponse?: (result: any) => any
) {
  return async (req: Request, res: Response) => {
    const query = (req.query.q as string).toLowerCase();
    if (query === "" || typeof query !== "string") {
      return res.status(400).json({ message: "Missing query" });
    }
    const cached = await redis.hGet(redisKey, query);
    let result;
    if (!cached) {
      const response = await (
        await fetch(typeof url === "function" ? url(query) : url)
      ).json();
      result = response;
      if (transformResponse) {
        result = transformResponse(result);
      }
      await redis.hSet(redisKey, query, JSON.stringify(result));
    } else {
      result = JSON.parse(cached);
    }
    return res.json(result);
  };
}

export async function setRedisKeyExpiry() {
  // Expire the cache after 24 hours
  // (except location and city search suggestions that are cached forever)
  // Redis version on Render is <7 and so we have to check for expiry ourselves
  if (await redis.expireTime("forecast") === -1) {
    await redis.expire("forecast", 60 * 60 * 24);
  }
  if (await redis.expireTime("current") === -1) {
    await redis.expire("current", 60 * 60 * 24);
  }
}
