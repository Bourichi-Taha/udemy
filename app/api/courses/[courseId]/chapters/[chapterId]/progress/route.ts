import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { chapterId: string; courseId: string; } }) {
    try {
        const { userId } = auth();
        const { chapterId, courseId } = params;
        const { isCompleted } = await req.json()
        if (!userId) {
            return new NextResponse("Unauthorized!", { status: 401 });
        }
        const course = await db.course.findUnique({
            where: {
                id: courseId,
            }
        });
        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
            }
        });
        if (!course || !chapter) {
            return new NextResponse("Not found!", { status: 404 });
        }
        const userProgress = await db.userProgress.upsert({
            where: {
                userId_chapterId:{
                    userId,
                    chapterId
                }
            },
            update: {
                isCompleted,

            },
            create: {
                userId,
                chapterId,
                isCompleted
            }
        });

        

        return NextResponse.json(userProgress);
    } catch (error) {
        console.log("[COURSE_ID_CHAPTERS_CHAPTER_ID_PROGRESS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
