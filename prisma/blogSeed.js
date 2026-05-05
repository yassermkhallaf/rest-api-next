import { PrismaClient } from "../app/generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg"
import "dotenv/config"
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })
async function main() {
    const userId = "bd6578a7-b618-47d2-a405-c31ec7436851";
    const categoryId = "a8021a3a-9e0e-48b4-9cf3-2b76bc907aa7";
    const blogs = Array.from({ length: 50 }).map((_, i) => {
        return {
            title: `Blog ${i + 1}`,
            description: `This is blog number ${i + 1}`,
            userId,
            categoryId,

            createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        }
    })
    await prisma.blog.createMany({
        data: blogs
    })
    console.log("✅ 50 blogs created");
}

main().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
})