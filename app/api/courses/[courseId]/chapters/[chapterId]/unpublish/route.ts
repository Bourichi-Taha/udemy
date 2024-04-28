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
        if (!chapter) {
            return new NextResponse("Not found!", { status: 404 });
        }
        const unpublishedChapter = await db.chapter.update({
            where: {
                id: chapterId,
            },
            data: {
                isPublished: false,
            }
        });
        const publishedChaptersIncourse = await db.chapter.findMany({//checking if course still have other published courses or you have to unpublish the course too. reason not enough published chapters
            where: {
                courseId: courseId,
                isPublished: true,
            }
        });
        if (!publishedChaptersIncourse.length) {
            await db.course.update({
                where: {
                    id: courseId,
                },
                data: {
                    isPublished: false,
                }
            });
        }
        return NextResponse.json(unpublishedChapter);

    } catch (error) {
        console.log("[COURSE_ID_CHAPTERS_CHAPTER_ID_UNPUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }

}