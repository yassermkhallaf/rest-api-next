import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validate as isUUID } from "uuid"
import { hashPassword } from "@/lib/auth";
export const GET = async () => {
    try {

        const users = await prisma.user.findMany();


        return NextResponse.json({ users }, { status: 200 })
    } catch (e: any) {
        return new NextResponse(`Error in fetching users: ${e.message}`, { status: 500 })
    }

}
export const POST = async (request: Request) => {
    try {
        const body = await request.json();
        const passwordHash = await hashPassword(body.password);
        const newUser = await prisma.user.create({
            data: { email: body.email, passwordHash }
        })
        return NextResponse.json({ user: newUser }, { status: 200 })
    } catch (error: any) {

        return new NextResponse(`Error in creating user: ${error.message}`, { status: 500 })

    }
}



export const DELETE = async (request: Request) => {
    try {
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
        await prisma.user.delete({
            where: { id: userId }
        })
        return new NextResponse(JSON.stringify({ message: `user with id: ${userId} is deleted` }), { status: 200 })
    } catch (error: any) {
        console.error(error);
        return new NextResponse(`Error in creating user: ${error.message}`, { status: 500 })

    }
}