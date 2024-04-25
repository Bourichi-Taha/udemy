import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req:Request,{params}:{params:{courseId:string}}) {
    try {
        const { userId } = auth();
        const { courseId } = params;
        const {title} = await req.json();
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

        const lastChapter = await db.chapter.findFirst({
            where: {
                courseId,
            },
            orderBy:{
                position:"desc"
            }
        });
        const position = lastChapter ? lastChapter.position+1 : 1;

        const chapter = await db.chapter.create({
            data: {
                title,
                courseId: courseId,
                position,
            }
        });

        return NextResponse.json(chapter);

    } catch (error) {
        console.log("[CHAPTERS]",error);
        return new NextResponse("Internal Error", {status:500});
    }
}