import { getCourses } from "@/actions/courses"
import { columns } from "@/app/(dashboard)/(routes)/teacher/courses/_components/columns"
import { DataTable } from "@/app/(dashboard)/(routes)/teacher/courses/_components/data-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"


const CoursesPage = async() => {
  const courses = await getCourses();
  return (
    <div className="p-6">

      <DataTable columns={columns} data={courses} />
    </div>
  )
}

export default CoursesPage