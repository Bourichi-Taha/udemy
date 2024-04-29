import { getDashboardCourses } from "@/actions/courses";
import CoursesList from "@/components/common/courses-list";
import InfoCard from "@/components/dashboard/info-card";
import { auth } from "@clerk/nextjs";
import { CheckCircle, Lock } from "lucide-react";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

export default async function Dashboard() {

  const {userId} = auth();
  if (!userId) {
    toast.error("Unauthorized!");
    return redirect('/');
  }

  const {completedCourses,coursesInProgress} = await getDashboardCourses(userId);



  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Lock}
          label={"In Progress"}
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
        variant="success"
          icon={CheckCircle}
          label={"Completed"}
          numberOfItems={completedCourses.length}
        />

      </div>
      <CoursesList items={[...coursesInProgress,...completedCourses]} />
    </div>
  );
}
