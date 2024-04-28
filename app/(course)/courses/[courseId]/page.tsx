import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";



interface SingleCourseIdPageProps {
  params: { courseId: string },
}

const SingleCourseIdPage = async(props:SingleCourseIdPageProps) => {

  const {courseId} = props.params;

  const course = await db.course.findUnique({
    where:{
      id:courseId
    },
    include: {
      chapters: {
        where:{
          isPublished:true,
        },
        orderBy: {
          position: "asc"
        }
      }
    }
  });

  if (!course) {
    toast.error("Course not found!");
    return redirect('/');
  }

  return redirect(`/courses/${courseId}/chapters/${course.chapters[0].id}`);
}

export default SingleCourseIdPage