import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validate as isUUID } from "uuid"
import { validateUserAndCategory } from "@/lib/utils/utils";
import { title } from "process";


export const GET = async (request: Request) => {
    try {
        const result = await validateUserAndCategory(request);

        if ("error" in result) {

            return NextResponse.json(
                { message: result.error },
                { status: result.status }
            )
        }
        const { userId, categoryId } = result;
        const { searchParams } = new URL(request.url);
        const searchKeywords = searchParams.get("keywords")?.trim() as string
        const startDate = searchParams.get("startDate")?.trim() as string
        const endDate = searchParams.get("endDate")?.trim() as string
        const page = parseInt(searchParams.get("page")?.trim() as string || "1")
        const limit = parseInt(searchParams.get("limit")?.trim() as string || "10")

        const filter: any = {
            categoryId, category: {
                userId
            }
        }
        if (searchKeywords) {
            filter.OR = [
                {
                    title: {
                        contains: searchKeywords,
                        mode: "insensitive"
                    }
                },
                {
                    description: {
                        contains: searchKeywords,
                        mode: "insensitive"
                    }
                }
            ]
        }
        if (startDate && endDate) {
            filter.createdAt = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            }
        } else if (startDate) {
            filter.createdAt = {
                gte: new Date(startDate),

            }
        } else if (endDate) {
            filter.createdAt = {
                lte: new Date(endDate)
            }
        }
        const skip = (page - 1) * limit;
        const blogs = await prisma.blog.findMany(
            {
                where: filter,
                orderBy: {
                    createdAt: "desc"
                },
                skip,
                take: limit

            },

        )
        return NextResponse.json({ message: "success", blogs, startDate: startDate ? new Date(startDate) : undefined }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};

export const POST = async (request: Request) => {
    try {
        const result = await validateUserAndCategory(request);

        if ("error" in result) {

            return NextResponse.json(
                { message: result.error },
                { status: result.status }
            )
        }
        const { userId, categoryId } = result;
        const body = await request.json();
        const { description, title } = body;
        if (!description || !title) {
            return NextResponse.json(
                { message: "Required fields not found" },
                { status: 400 }
            )
        }
        const newblog = await prisma.blog.create({
            data: {
                title,
                description,
                categoryId,
                userId
            }
        }
        )
        return NextResponse.json({ message: "success", newblog }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};

