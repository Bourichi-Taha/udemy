import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PUT(req:Request,{params}:{params:{courseId:string;}}) {
    try {
        const { userId } = auth();
        const { courseId } = params;
        const {data} = await req.json();
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
        
        for (let item of data) {
            await db.chapter.update({
                where:{
                    id: item.id,
                },
                data:{
                    position:item.position
                }
            });
        }

        return new NextResponse("Success",{status:200});
    } catch (error) {
        console.log("[REORDER]",error);
        return new NextResponse("Internal Error", {status:500});
    }
}