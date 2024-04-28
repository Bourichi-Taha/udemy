import { Chapter, Course, UserProgress } from "@prisma/client";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Menu } from "lucide-react";
import CourseSidebar from "./course-sidebar";


interface CourseMobileSidebarProps {
    course: Course & {
        chapters: (Chapter & {userProgress: UserProgress[]|null})[]
    };
    progressCount: number;
}

const CourseMobileSidebar = (props:CourseMobileSidebarProps) => {

    const {course,progressCount} = props;

  return (
    <Sheet>
        <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
            <Menu />
        </SheetTrigger>
        <SheetContent side={"left"} className="p-0 bg-white w-72">
            <CourseSidebar course={course} progressCount={progressCount} />
        </SheetContent> 
    </Sheet>
  )
}

export default CourseMobileSidebar