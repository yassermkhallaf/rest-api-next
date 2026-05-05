import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signAccessToken, signRefreshToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
    });

    return NextResponse.json({ accessToken, refreshToken });
}