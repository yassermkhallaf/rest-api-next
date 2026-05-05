import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signAccessToken, signRefreshToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ error: "Email taken" }, { status: 409 });

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({ data: { email, passwordHash } });
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