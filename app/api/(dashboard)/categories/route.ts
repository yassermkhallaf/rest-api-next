import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validate as isUUID } from "uuid"

export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
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
        const categories = await prisma.category.findMany();
        return new NextResponse(JSON.stringify(categories), { status: 200 });
    } catch (error: any) {
        console.error(error);
        return new NextResponse(`Error : ${error.message}`, { status: 500 })
    }
}

export const POST = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
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
        const body = await request.json();
        const { title } = body;
        if (!title) {
            return new NextResponse(JSON.stringify({ messsge: "Invalid body" }), { status: 400 })
        }
        const newCategory = await prisma.category.create({
            data: { title, userId }
        });
        return new NextResponse(JSON.stringify(newCategory), { status: 200 });
    } catch (error: any) {
        console.error(error);
        return new NextResponse(`Error : ${error.message}`, { status: 500 })
    }
}