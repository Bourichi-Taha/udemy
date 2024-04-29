"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Category, Course } from "@prisma/client";
import { redirect } from "next/navigation";
import { getProgress } from "./user-progress";

export const getCourseByIdWithAttachmentsAndChapters = async (courseId: string) => {
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
            attachments: {
                orderBy: {
                    createdAt: "desc",
                }
            },
            chapters: {
                orderBy: {
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
export const getCourseByIdWithPublishedChaptersAndUserProgress = async (userId:string,courseId: string) => {

    const course = await db.course.findUnique({
        where: {
            id: courseId,
        },
        include: {
            chapters: {
                orderBy: {
                    position: "asc",
                },
                where: {
                    isPublished: true,
                },
                include: {
                    userProgress:{
                        where: {
                            userId,
                        }
                    }
                }
            },
            
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
        return redirect("/");
    }
    const courses = await db.course.findMany({
        where: {
            userId: userId
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    return courses || [];
}

export type CourseWithCategoryWithProgress = Course & {
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null;
}

type GetCoursesWithCategory = {
    title?: string;
    categoryId?: string;
}

export const getCoursesWithCategory = async ({ title, categoryId }: GetCoursesWithCategory): Promise<CourseWithCategoryWithProgress[]> => {
    try {
        const { userId } = auth();
        if (!userId) {
            return redirect("/");
        }
        const courses = await db.course.findMany({
            where: {
                categoryId,
                isPublished:true,
                title: {
                    contains: title
                }
            },
            include: {
                category: true,
                chapters: {
                    where: {
                        isPublished:true
                    },
                    select: {
                        id :true
                    }
                },
                purchases: {
                    where: {
                        userId,
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const coursesWithProgress = await Promise.all(
            courses.map(async(course)=>{
                if (course.purchases.length === 0) {
                    return {
                        ...course,
                        progress:null,
                    }
                }

                const progressPercentage = await getProgress(userId,course.id);

                return {
                    ...course,
                    progress:progressPercentage
                }
            })
        );

        return coursesWithProgress;

    } catch (error) {
        console.log("[GET_COURSES_WITH_CATEGORY]", error);
        return [];
    }
}

type DashboardCourses = {
    completedCourses: CourseWithCategoryWithProgress[];
    coursesInProgress: CourseWithCategoryWithProgress[];
}

export const getDashboardCourses = async (userId:string):Promise<DashboardCourses> => {

    try {
        const purshasedCourses = await db.purchase.findMany({
            where: {
                userId,
            },
            select: {
                course:{
                    include: {
                        category:true,
                        chapters: {
                            where: {
                                isPublished:true,
                            }
                        }
                    }
                }
            }
        });
        const courses = purshasedCourses.map((purshase)=>({...purshase.course,progress:0})) as CourseWithCategoryWithProgress[];

        for(let course of courses){
            const progress = await getProgress(userId,course.id);
            course["progress"] = progress;
        }

        const completedCourses = courses.filter((course)=>{
            if (course.progress && course.progress >= 100) {
                return true;
            }
            return false;
        });
        const coursesInProgress = courses.filter((course)=>{
            if (course.progress && course.progress < 100) {
                return true;
            }
            return false;
        });

        return {
            completedCourses,
            coursesInProgress
        }

    } catch (error) {
        console.log("[GET_DASHBOARD_COURSES]", error);
        return {
            completedCourses:[],
            coursesInProgress:[]
        };
    }

}