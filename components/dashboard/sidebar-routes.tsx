"use client";

import { GUEST_ROUTES, TEACHER_ROUTES } from "@/constants/routes";
import SidebarItem from "./sidebar-item";
import { usePathname } from "next/navigation";



const SidebarRoutes = () => {

  const pathname = usePathname();

  const isTeacherPage = pathname?.includes("/teacher");
  const routes = isTeacherPage ? TEACHER_ROUTES : GUEST_ROUTES;

  return (
    <div className="flex flex-col w-full">
        {
            routes.map((route,index) => (
                <SidebarItem key={index} icon={route.icon} label={route.label} href={route.href} />
            ))
        }
    </div>
  )
}

export default SidebarRoutes