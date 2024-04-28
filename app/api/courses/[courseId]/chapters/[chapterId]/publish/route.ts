import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function PATCH(req: Request, { params }: { params: { chapterId: string; courseId: string; } }) {

    try {
        const { userId } = auth();
        const { chapterId, courseId } = params;
        if (!userId) {
            return new NextResponse("Unauthorized!", { status: 401 });
        }
        const course = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId
            }
        });
        if (!course) {
            return new NextResponse("Unauthorized!", { status: 401 });
        }
        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                courseId: courseId
            },
            include: {
                muxData:true
            }
        });
        if (!chapter || !chapter.muxData || !chapter.title || !chapter.description || !chapter.videoUrl) {
            return new NextResponse("Missing required fields!", { status: 400 });
        }
        const publishedChapter = await db.chapter.update({
            where: {
                id: chapterId,
            },
            data: {
                isPublished: true,
            }
        });
        return NextResponse.json(publishedChapter);

    } catch (error) {
        console.log("[COURSE_ID_CHAPTERS_CHAPTER_ID_PUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }

}