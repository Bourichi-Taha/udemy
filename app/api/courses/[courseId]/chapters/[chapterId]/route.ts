import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Mux from '@mux/mux-node';

const { video } = new Mux({
    tokenId:process.env.MUX_TOKEN_ID!,
    tokenSecret:process.env.MUX_TOKEN_SECRET!}
)

export async function PATCH(req: Request, { params }: { params: { chapterId: string; courseId: string; } }) {
    try {
        const { userId } = auth();
        const { chapterId, courseId } = params;
        const { isPublished, ...values } = await req.json()
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
        const updated = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId
            },
            data: {
                ...values
            }
        });

        if (values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where:{
                    chapterId
                }
            });
            if (existingMuxData) {
                await video.assets.delete(existingMuxData.assetId);
                await db.muxData.delete({
                    where:{
                        id:existingMuxData.id
                    }
                })
            }
            const asset = await video.assets.create({
                input:values.videoUrl,
                playback_policy:["public"],
                test:false,
            });
            await db.muxData.create({
                data:{
                    chapterId,
                    assetId:asset.id,
                    playbackId:asset.playback_ids?.[0].id,
                    
                }
            })
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.log("[COURSE_ID_CHAPTERS_CHAPTER_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}