import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const userId = getUserFromRequest(req);

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, createdAt: true },
        });
        return NextResponse.json({ ...user, now: new Date() });
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}