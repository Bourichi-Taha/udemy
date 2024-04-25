import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(req:Request,{params}:{params:{attachmentId:string;courseId:string;}}) {
    try {
        const { userId } = auth();
        const { attachmentId,courseId } = params;
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
        const deleted=await db.attachment.delete({
            where:{
                id:attachmentId,
                courseId:courseId
            }
        });
        return NextResponse.json(deleted);
    } catch (error) {
        console.log("[COURSE_ID_ATTACHMENTS_ATTACHMENT_ID]",error);
        return new NextResponse("Internal Error", {status:500});
    }
}