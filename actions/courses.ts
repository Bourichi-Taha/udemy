"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export const getCourseById = async (courseId: string) => {
    const { userId } = auth();
    if (!userId) {
        return redirect("/");
    }
    const course = await db.course.findFirst({
        where: {
            id: courseId,
            userId: userId
        }
    });
    if (!course) {
        return redirect("/");
    }
    return course;
}