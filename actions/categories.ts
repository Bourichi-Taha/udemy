"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Category } from "@prisma/client";
import { redirect } from "next/navigation";

export const getCategories = async():Promise<Category[]> => {
    const { userId } = auth();
    if (!userId) {
        return redirect("/");
    }
    const categories = await db.category.findMany({
        orderBy: {
            name: "asc"
        }
    });
    return categories || [];
}