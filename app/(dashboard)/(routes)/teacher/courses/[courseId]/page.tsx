import { getCourseById } from "@/actions/courses";
import IconBadge from "@/components/common/icon-badge";
import DescriptionForm from "@/components/dashboard/teacher/courses/description-form";
import TitleForm from "@/components/dashboard/teacher/courses/title-form";
import { LayoutDashboard } from "lucide-react";

interface CoursePageProps {
    params: {courseId:string},
}

const CoursePage = async(props:CoursePageProps) => {

    const {courseId} = props.params;
    const course = await getCourseById(courseId);
    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId
    ];
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
        <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">
                    Course setup
                </h1>
                <span className="text-sm text-slate-700">
                    Complete all Fields {completionText}
                </span>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <div className="">
                <div className="flex items-center gap-x-2">
                    <IconBadge icon={LayoutDashboard} />
                    <h2 className="text-xl">
                        Customize your course
                    </h2>
                </div>
                <TitleForm title={course.title} courseId={course.id}  />
                <DescriptionForm description={course.description} courseId={course.id}  />
            </div>
        </div>
    </div>
  )
}

export default CoursePage