"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

export const getCourseById = async (courseId: string) => {
    const { userId } = auth();
    if (!userId) {
        return redirect("/");
    }
    const course = await db.course.findFirst({
        where: {
            id: courseId,
            userId: userId
        },
        include: {
            attachments :{
                orderBy : {
                    createdAt: "desc",
                }
            },
            chapters: {
                orderBy : {
                    position: "asc",
                }
            }
        }
    });
    if (!course) {
        return redirect("/");
    }
    return course;
}

export const getCourses = async () => {
    const { userId } = auth();
    if (!userId) {
        toast.error("Unauthorized!");
        return redirect("/");
    }
    const courses = await db.course.findMany({
        where: {
            userId:userId
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    return courses || [];
}