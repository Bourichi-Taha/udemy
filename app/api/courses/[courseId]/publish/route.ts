import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { courseId: string; } }) {
    try {
        const { userId } = auth();
        const {  courseId } = params;
        if (!userId) {
            return new NextResponse("Unauthorized!", { status: 401 });
        }
        const course = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId
            },
            include: {
                chapters:true,
            }
        });
        if (!course || !course.title || !course.price || !course.description || !course.imageUrl || !course.categoryId || !course.chapters.some((chpt)=>chpt.isPublished)) {
            return new NextResponse("Unauthorized!", { status: 401 });
        }


        const publishedCourse = await db.course.update({
            where: {
                id: courseId,
            },
            data:{
                isPublished:true,
            }
        });

        

        return NextResponse.json(publishedCourse);


    } catch (error) {
        console.log("[COURSE_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}