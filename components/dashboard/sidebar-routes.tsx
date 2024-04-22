"use client";

import { GUEST_ROUTES } from "@/constants/routes";
import SidebarItem from "./sidebar-item";



const SidebarRoutes = () => {
  return (
    <div className="flex flex-col w-full">
        {
            GUEST_ROUTES.map((route,index) => (
                <SidebarItem key={index} icon={route.icon} label={route.label} href={route.href} />
            ))
        }
    </div>
  )
}

export default SidebarRoutes