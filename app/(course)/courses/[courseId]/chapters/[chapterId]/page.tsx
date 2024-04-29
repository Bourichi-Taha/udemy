
import { getChapterForCoursePage } from "@/actions/chapters";
import Banner from "@/components/common/banner";
import Preview from "@/components/common/preview";
import CourseEnrollButton from "@/components/course/chapters/course-enroll-button";
import CourseProgressButton from "@/components/course/chapters/course-progress-button";
import VideoPlayer from "@/components/course/chapters/video-player";
import { Separator } from "@/components/ui/separator";
import { File } from "lucide-react";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";


interface SingleChapterIdPageProps {
  params: { courseId: string, chapterId: string },
}

const SingleChapterIdPage = async (props: SingleChapterIdPageProps) => {

  const { chapterId, courseId } = props.params;

  const { chapter, attachements, course, muxData, nextChapter, purshase, userProgress } = await getChapterForCoursePage(courseId, chapterId);

  if (!chapter || !course) {
    toast.error("chapter or course not found!");
    return redirect("/")
  }

  const isLocked = !chapter.isFree && !purshase;

  const completeOnEnd = !!purshase && !userProgress?.isCompleted;

  return (
    <div className="">
      {
        userProgress?.isCompleted && (
          <Banner label="You already completed this Chapter" variant={"success"} />
        )
      }
      {
        isLocked && (
          <Banner label="You need to purchase this course to watch this chapter!" variant={"warning"} />
        )
      }
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={chapterId}
            title={chapter.title}
            courseId={courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div className="">
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">
              {
                chapter.title
              }
            </h2>
            {
              purshase ? (
                <CourseProgressButton 
                  chapterId={chapterId}
                  courseId={courseId}
                  nextChapterId={nextChapter?.id}
                  isCompleted={!!userProgress?.isCompleted}
                />
              ) : (
                <CourseEnrollButton 
                  courseId={courseId}
                  price={course.price!}
                />
              )
            }
          </div>
          <Separator />
          <div className="">
            <Preview value={chapter.description!} />
          </div>
          {
            !!attachements.length && (
              <>
                <Separator />
                <div className="p-4 space-y-2">
                  {attachements.map((attachment)=>(
                    <a href={attachment.url} target="_blank" key={attachment.id} className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline" >
                      <File />
                      <p className="line-clamp-1">
                        {attachment.name}
                      </p>
                    </a>
                  ))}
                </div>
              </>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default SingleChapterIdPage