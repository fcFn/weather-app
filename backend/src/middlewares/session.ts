import { getIronSession } from "iron-session";
import type {Request, Response} from "express";
export interface DWSession {
  username: string;
}
async function getSession(req: Request, res: Response) {
  const session = await getIronSession<DWSession>(req, res, {
    password: process.env.IRON_SESSION_PASS ?? "",
    cookieName: "session",
    cookieOptions:
      process.env?.APP_ENV === "dev"
        ? { secure: false, sameSite: "lax" }
        : { secure: true, path: "/", sameSite: "none" },
  });
  return session
}

export default async function session(req: Request, res: Response, next: any) {
  const session = await getSession(req, res);
  res.locals.session = session;
  next();
}
