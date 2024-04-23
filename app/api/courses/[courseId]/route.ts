import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function GET(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const { userId } = auth();
        const { courseId } = params;
        if (!userId) {
            return new NextResponse("Unauthorized!", { status: 401 });
        }
        const course = await db.course.findFirst({
            where: {
                id: courseId,
                userId: userId
            }
        });
        if (!course) {
            return new NextResponse("Not found!", { status: 404 });
        }
        return NextResponse.json(course);
    } catch (error) {
        console.log("[COURSES]",error);
        return new NextResponse("Internal Error", {status:500});
    }

}