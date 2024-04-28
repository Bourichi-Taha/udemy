"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

export const GetPurshaseForCourseIdPage = async (courseId: string) => {
    const { userId } = auth();
    if (!userId) {
        toast.error("Unauthorized!");
        return redirect("/");
    }
    const purshase = await db.purchase.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId
            }
        }
    });
    return purshase;
}