import { getChapterById } from "@/actions/chapters";
import Banner from "@/components/common/banner";
import IconBadge from "@/components/common/icon-badge";
import AccessForm from "@/components/dashboard/teacher/courses/chapter/access-form";
import ChapterActions from "@/components/dashboard/teacher/courses/chapter/chapter-actions";
import DescriptionForm from "@/components/dashboard/teacher/courses/chapter/description-form";
import TitleForm from "@/components/dashboard/teacher/courses/chapter/title-form";
import VideoForm from "@/components/dashboard/teacher/courses/chapter/video-form";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";

interface ChapterIdPageProps {
    params: { courseId: string, chapterId: string },
}

const ChapterIdPage = async (props: ChapterIdPageProps) => {
    const { chapterId, courseId } = props.params;

    const chapter = await getChapterById(chapterId, courseId);

    const requiredFields = [
        chapter.title,
        chapter.description,
        chapter.videoUrl
    ];
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);

    return (
        <>
        {!chapter.isPublished && (
            <Banner variant={"warning"} label="This chapter is unpublished. It will not be visible in course." />
        )}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="w-full">
                        <Link href={`/teacher/courses/${courseId}`} className="flex items-center text-sm hover:opacity-75 transition mb-6">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to course
                        </Link>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Chapter Setup
                                </h1>
                                <span className="text-sm text-slate-700">
                                    Complete all fields {completionText}
                                </span>
                            </div>
                            <ChapterActions disabled={!isComplete} courseId={courseId} chapterId={chapterId} isPublished={chapter.isPublished} />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div className="space-y-4">
                        <div className="">
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={LayoutDashboard} />
                                <h2 className="text-xl">
                                    Customize your chapter
                                </h2>
                            </div>
                            <TitleForm title={chapter.title} courseId={courseId} chapterId={chapterId} />
                            <DescriptionForm description={chapter.description} courseId={courseId} chapterId={chapterId} />

                        </div>
                        <div className="">
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={Eye} />
                                <h2 className="text-xl">
                                    Access settings
                                </h2>
                            </div>
                            <AccessForm isFree={chapter.isFree} courseId={courseId} chapterId={chapterId} />
                        </div>
                    </div>
                    <div className="">
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={Video} />
                            <h2 className="text-xl">
                                Add a video
                            </h2>
                        </div>
                        <VideoForm videoUrl={chapter.videoUrl} courseId={courseId} chapterId={chapterId} muxData={chapter.muxData} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChapterIdPage