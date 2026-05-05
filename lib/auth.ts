import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
export const hashPassword = (pw: string) => bcrypt.hash(pw, 12);
export const verifyPassword = (pw: string, hash: string) => bcrypt.compare(pw, hash);
export const signAccessToken = (userId: string) =>
    jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: "15m" });
export const signRefreshToken = (userId: string) =>
    jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: "30d" });
export const verifyAccessToken = (token: string) =>
    jwt.verify(token, ACCESS_SECRET) as { userId: string };
export const verifyRefreshToken = (token: string) =>
    jwt.verify(token, REFRESH_SECRET) as { userId: string };

export function getUserFromRequest(req: NextRequest): string {
    const auth = req.headers.get("authorization");

    if (!auth?.startsWith("Bearer ")) throw new Error("No token");
    const token = auth.slice(7);
    const { userId } = verifyRefreshToken(token);

    return userId;
}