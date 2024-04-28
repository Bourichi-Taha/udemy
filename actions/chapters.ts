"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Attachment, Chapter } from "@prisma/client";
import { redirect } from "next/navigation";

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
        return redirect("/");
    }
    return chapter;
}

export const getChapterForCoursePage = async (courseId:string,chapterId:string) => {
    try {
        const {userId} = auth();
        if (!userId) {
            return redirect("/");
        }
        const purshase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                },
            }
        });

        const course = await db.course.findUnique({
            where: {
                isPublished: true,
                id:courseId,
            },
            select: {
                price: true,
            }
        });

        const chapter = await db.chapter.findUnique({
            where: {
                isPublished: true,
                id: chapterId,
            }
        });

        if (!chapter || !course) {
            throw new Error("Chapter or course not found!");
        }

        let muxData = null;
        let attachements: Attachment[] = [];
        let nextChapter: Chapter | null = null;

        if (purshase) {
            attachements = await db.attachment.findMany({
                where: {
                    courseId
                }
            })
        }

        if (chapter.isFree || purshase) {
            muxData = await db.muxData.findUnique({
                where: {
                    chapterId,
                }
            });
            nextChapter = await db.chapter.findFirst({
                where: {
                    courseId,
                    isPublished:true,
                    position: {
                        gt: chapter?.position,
                    }
                },
                orderBy: {
                    position: "asc",
                }
            });
        }

        const userProgress = await db.userProgress.findUnique({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId,
                }
            }
        });

        return {
            chapter,
            course,
            muxData,
            attachements,
            nextChapter,
            userProgress,
            purshase
        }

    } catch (error) {
        console.log("[GET_CHAPTER_FOR_COURSE_PAGE]",error);
        return {
            chapter: null,
            course: null,
            muxData: null,
            attachements: [],
            nextChapter: null,
            userProgress: null,
            purshase: null,
        }
    }
}