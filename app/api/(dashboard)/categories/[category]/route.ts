import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validate as isUUID } from "uuid"

export const PATCH = async (request: Request, { params }: { params: Promise<{ category: string }> }) => {

    try {
        const { category: categoryId } = await params;

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId")
        if (!userId) {
            return new NextResponse(JSON.stringify({ messsge: "User id  not found" }), { status: 400 })
        }
        if (!isUUID(userId)) {
            return new NextResponse(JSON.stringify({ messsge: "Invalid userId" }), { status: 400 })
        }
        const existedUser = await prisma.user.findUnique({ where: { id: userId } })
        if (!existedUser) {
            return new NextResponse(JSON.stringify({ messsge: "User not found in database" }), { status: 400 })
        }
        if (!isUUID(categoryId) || !categoryId) {
            return new NextResponse(JSON.stringify({ messsge: "Invalid or missing categoryId" }), { status: 400 })
        }
        const existCategory = await prisma.category.findUnique({ where: { id: categoryId, userId: userId } });
        if (!existCategory) {
            return new NextResponse(JSON.stringify({ messsge: "Category not found in database" }), { status: 400 })
        }
        const body = await request.json();
        const { title } = body;

        if (!title) {
            return new NextResponse(JSON.stringify({ messsge: "Some required fields not found" }), { status: 400 })
        }
        const updatedCategory = await prisma.category.update({
            where: { id: categoryId },
            data: { title }
        })
        return NextResponse.json({ message: "success", category: updatedCategory }, { status: 200 });
    } catch (error: any) {

        return NextResponse.json({ error: "Error in updtating category" }, { status: 500 });
    }
};

export const DELETE = async (request: Request, { params }: { params: Promise<{ category: string }> }) => {
    try {
        const { category: categoryId } = await params;

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId")
        if (!userId) {
            return new NextResponse(JSON.stringify({ messsge: "User id  not found" }), { status: 400 })
        }
        if (!isUUID(userId)) {
            return new NextResponse(JSON.stringify({ messsge: "Invalid userId" }), { status: 400 })
        }
        const existedUser = await prisma.user.findUnique({ where: { id: userId } })
        if (!existedUser) {
            return new NextResponse(JSON.stringify({ messsge: "User not found in database" }), { status: 400 })
        }
        if (!isUUID(categoryId) || !categoryId) {
            return new NextResponse(JSON.stringify({ messsge: "Invalid or missing categoryId" }), { status: 400 })
        }
        const existCategory = await prisma.category.findUnique({ where: { id: categoryId } });
        if (!existCategory) {
            return new NextResponse(JSON.stringify({ messsge: "Category not found in database" }), { status: 400 })
        }
        const deletedCategory = await prisma.category.delete({
            where: { id: categoryId }
        })
        return NextResponse.json({ message: "success", deletedCategory }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};