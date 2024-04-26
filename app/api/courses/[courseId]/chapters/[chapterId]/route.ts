import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(req:Request,{params}:{params:{chapterId:string;courseId:string;}}) {
    try {
        const { userId } = auth();
        const { chapterId,courseId } = params;
        const values = await req.json()
        if (!userId) {
            return new NextResponse("Unauthorized!", { status: 401 });
        }
        const course = await db.course.findUnique({
            where:{
                id:courseId,
                userId:userId
            }
        });
        if (!course) {
            return new NextResponse("Unauthorized!", { status: 401 });
        }
        const updated=await db.chapter.update({
            where:{
                id:chapterId,
                courseId:courseId
            },
            data:{
                ...values
            }
        });
        return NextResponse.json(updated);
    } catch (error) {
        console.log("[COURSE_ID_CHAPTERS_CHAPTER_ID]",error);
        return new NextResponse("Internal Error", {status:500});
    }
}