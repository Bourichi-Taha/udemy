"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

export const getChapterById = async(id:string,courseId:string) => {
    const { userId } = auth();
    if (!userId) {
        return redirect("/");
    }
    const course = await db.course.findUnique({
        where:{
            id:courseId,
            userId
        }
    });
    if (!course) {
        toast.error("You can't edit chapters that doesn't belong to you!");
        return redirect("/");
    }
    const chapter = await db.chapter.findUnique({
        where:{
            id,
        },
        include:{
            muxData:true
        }
    });
    if (!chapter) {
        toast.error("Chapter doesn't exsits!");
        return redirect("/");
    }
    return chapter;
}