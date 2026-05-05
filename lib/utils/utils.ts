import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validate as isUUID } from "uuid"
export async function validateUserAndCategory(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    // 🔹 Validate userId
    if (!userId) {
        return { error: "User id not found", status: 400 };
    }
    if (!isUUID(userId)) {
        return { error: "Invalid userId", status: 400 };
    }
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        return { error: "User not found in database", status: 404 };
    }
    // 🔹 Validate categoryId
    if (!categoryId) {

        return { error: "Category id not found", status: 400 };
    }
    if (!isUUID(categoryId)) {
        return { error: "Invalid category id", status: 400 };
    }
    const category = await prisma.category.findUnique({
        where: { id: categoryId },
    });
    if (!category) {
        return { error: "Category not found", status: 404 };
    }
    return { userId, categoryId };
}