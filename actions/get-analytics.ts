"use server";

import { db } from "@/lib/db";
import { Course, Purchase } from "@prisma/client";

type PurshaseWithCourse = Purchase & {
    course: Course;
};

const groupByCourse = (purshases: PurshaseWithCourse[]) => {
    const grouped: {[courseTitle:string]:number} ={};

    purshases.forEach((purshase) => {
        const courseTitle = purshase.course.title;
        if (!grouped[courseTitle]) {
            grouped[courseTitle] = 0;
        }
        grouped[courseTitle] += purshase.course.price!;

    });

    return grouped;
}

export const getAnalytics = async (userId:string) => {
    try {
        
        const purshases = await db.purchase.findMany({
            where:{
                course: {
                    userId,
                },
            },
            include: {
                course: true,
            }
        });

        const groupedEarning = groupByCourse(purshases);

        const data = Object.entries(groupedEarning).map(([courseTitle,total])=>({
            name:courseTitle,
            total:total,
        }));

        const totalRevenue = data.reduce((acc,curr) => acc + curr.total,0);
        const totalSales = purshases.length;

        return {
            data,
            totalRevenue,
            totalSales
        }

    } catch (error) {
        console.log("[GET_ANALYTICS]",error);
        return {
            data:[],
            totalRevenue:0,
            totalSales:0
        }
    }

}
