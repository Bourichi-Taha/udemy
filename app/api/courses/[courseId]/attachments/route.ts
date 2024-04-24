import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req:Request,{params}:{params:{courseId:string}}) {
    try {
        const { userId } = auth();
        const { courseId } = params;
        const {url} = await req.json();
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
            return new NextResponse("Not found!", { status: 404 });
        }

        const attachment = await db.attachment.create({
            data: {
                url,
                name: url.split('/').pop(),
                courseId: courseId
            }
        });

        return NextResponse.json(attachment);

    } catch (error) {
        console.log("[COURSE_ID_ATTACHMENTS]",error);
        return new NextResponse("Internal Error", {status:500});
    }
}