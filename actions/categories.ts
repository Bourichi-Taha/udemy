"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export const getCategories = async() => {
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