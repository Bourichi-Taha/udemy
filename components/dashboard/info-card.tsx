import { LucideIcon } from "lucide-react";
import IconBadge from "../common/icon-badge";


interface InfoCardProps {
    label:string;
    numberOfItems:number;
    icon:LucideIcon;
    variant?:"default"|"success";
}

const InfoCard = (props:InfoCardProps) => {

    const {icon:Icon,label,numberOfItems,variant} = props;

  return (
    <div className="border rounded-md flex items-center gap-x-2 p-3">
        <IconBadge variant={variant||"default"} icon={Icon} />
        <div className="">
            <p className="font-medium">
                {label}
            </p>
            <p className="text-gray-500 text-sm">
                {numberOfItems} {numberOfItems > 1 ? "Courses" : "Course"}
            </p>
        </div>
    </div>
  )
}

export default InfoCard