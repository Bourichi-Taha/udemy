"use client";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-strore";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseProgressButtonProps {
    courseId:string;
    chapterId:string;
    nextChapterId:string|undefined;
    isCompleted?: boolean;
}

const CourseProgressButton = (props:CourseProgressButtonProps) => {

    const {chapterId,courseId,isCompleted,nextChapterId} = props;

    const Icon = isCompleted ? XCircle : CheckCircle;

    const router = useRouter();
    const confetti = useConfettiStore();
    const [isLoading,setIsLoading] = useState(false);
    const onClick =async() => {
        try {
            setIsLoading(true);
            await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`,{isCompleted:!isCompleted});
            if (!isCompleted && !nextChapterId) {
                confetti.onOpen();
            }
            if (!isCompleted && nextChapterId) {
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
            }
            router.refresh();
            toast.success("Progress updated✨");
        } catch (error) {
            toast.error("Ops! Something went wrong!");
        }finally{
            setIsLoading(false);
        }
    }

  return (
    <Button onClick={onClick} disabled={isLoading} type="button" variant={isCompleted ? "outline" : "success"} className="w-full md:w-auto">
        {
            isCompleted ? "Not completed" : "Mark as complete"
        }
        <Icon className="h-4 w-4 ml-2" />
    </Button>
  )
}

export default CourseProgressButton