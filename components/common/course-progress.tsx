import { cn } from "@/lib/utils";
import { Progress } from "../ui/progress";


interface CourseProgressProps {
    variant?: "success" | "default";
    size?: "sm" | "default";
    value: number;
}

const ColorByVariant = {
    default: "text-sky-700",
    success: "text-emerald-700",
}

const SizeByVariant = {
    default: "text-sm",
    success: "text-xs",
}

const CourseProgress = (props:CourseProgressProps) => {

    const {value,variant,size} = props;

  return (
    <div className="">
        <Progress className="h-2" value={value} variant={variant} />
        <p className={cn("font-medium mt-2 text-sky-700",ColorByVariant[variant||"default"],SizeByVariant[variant||"default"])}>
            {Math.round(value)}% Complete 👌
        </p>
    </div>
  )
}

export default CourseProgress