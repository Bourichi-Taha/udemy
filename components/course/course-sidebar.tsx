import { GetPurshaseForCourseIdPage } from "@/actions/purshases";
import { Chapter, Course, UserProgress } from "@prisma/client"
import CourseSidebarItem from "./course-sidebar-item";
import CourseProgress from "../common/course-progress";


interface CourseSidebarProps {
    course: Course & {
        chapters: (Chapter & {userProgress: UserProgress[]|null})[]
    };
    progressCount: number;
}

const CourseSidebar = async(props:CourseSidebarProps) => {

    const {course,progressCount} = props;
    const purshase = await GetPurshaseForCourseIdPage(course.id);

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
        <div className="p-8 flex flex-col border-b">
            <h1 className="font-semibold">
                {course.title}
            </h1>
            {
                purshase && (
                    <div className="mt-10">
                        <CourseProgress 
                            variant="success"
                            value={progressCount}
                        />
                    </div>
                )
            }
        </div>
        <div className="flex flex-col w-full">
            {
                course.chapters.map((chapter) => (
                    <CourseSidebarItem key={chapter.id} id={chapter.id} label={chapter.title} isCompleted={!!chapter.userProgress?.[0]?.isCompleted} courseId={course.id} isLocked={!chapter.isFree && !purshase} />
                ))
            }
        </div>
    </div>
  )
}

export default CourseSidebar