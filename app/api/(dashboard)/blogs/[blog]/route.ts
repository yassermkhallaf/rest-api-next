import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validate as isUUID } from "uuid"
import { validateUserAndCategory } from "@/lib/utils/utils";


export const GET = async (request: Request, { params }: { params: Promise<{ blog: string }> }) => {
    try {
        const { blog: blogId } = await params;

        if (!isUUID(blogId) || !blogId) {
            return NextResponse.json(
                { message: "Not valid blog id" },
                { status: 400 }
            )
        }
        const result = await validateUserAndCategory(request);

        if ("error" in result) {

            return NextResponse.json(
                { message: result.error },
                { status: result.status }
            )
        }
        const { userId, categoryId } = result;

        const existedBlog = await prisma.blog.findFirst({
            where: {
                id: blogId,
                category: {
                    id: categoryId,
                    userId
                }
            }
        })
        return NextResponse.json({ message: "success", blog: existedBlog }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};

export const PATCH = async (request: Request, { params }: { params: Promise<{ blog: string }> }) => {
    try {
        const { blog: blogId } = await params;

        if (!isUUID(blogId) || !blogId) {
            return NextResponse.json(
                { message: "Not valid blog id" },
                { status: 400 }
            )
        }
        const result = await validateUserAndCategory(request);

        if ("error" in result) {

            return NextResponse.json(
                { message: result.error },
                { status: result.status }
            )
        }
        const { userId, categoryId } = result;
        const existedBlog = await prisma.blog.findFirst({
            where: {
                id: blogId,
                category: {
                    id: categoryId,
                    userId
                }
            }
        })
        if (!existedBlog) {
            return NextResponse.json(
                { message: "Blog not found in database" },
                { status: 400 }
            )
        }
        const body = await request.json();
        const { title, description } = body
        if (!description || !title) {
            return NextResponse.json(
                { message: "Required fields not found" },
                { status: 400 }
            )
        }
        const updatedBlog = await prisma.blog.update({
            where: {
                id: blogId,
                category: {
                    id: categoryId,
                    userId
                }
            },
            data: { title, description }
        })
        return NextResponse.json({ message: "success", blog: updatedBlog }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};
export const DELETE = async (request: Request, { params }: { params: Promise<{ blog: string }> }) => {
    try {
        const { blog: blogId } = await params;

        if (!isUUID(blogId) || !blogId) {
            return NextResponse.json(
                { message: "Not valid blog id" },
                { status: 400 }
            )
        }
        const result = await validateUserAndCategory(request);

        if ("error" in result) {

            return NextResponse.json(
                { message: result.error },
                { status: result.status }
            )
        }
        const { userId, categoryId } = result;
        const existedBlog = await prisma.blog.findFirst({
            where: {
                id: blogId,
                category: {
                    id: categoryId,
                    userId
                }
            }
        })
        if (!existedBlog) {
            return NextResponse.json(
                { message: "Blog not found in database" },
                { status: 400 }
            )
        }

        const deletedBlog = await prisma.blog.delete({
            where: {
                id: blogId,
                category: {
                    id: categoryId,
                    userId
                }
            },

        })
        return NextResponse.json({ message: "success", blog: deletedBlog }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};