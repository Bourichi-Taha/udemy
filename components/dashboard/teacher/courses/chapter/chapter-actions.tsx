"use client";

import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ChapterActionsProps {
    disabled: boolean;
    isPublished: boolean;
    courseId: string;
    chapterId: string;
}

const ChapterActions = (props: ChapterActionsProps) => {

    const { chapterId, courseId, disabled, isPublished } = props;
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onClick = async () => {
        try {
            setIsLoading(true);

            if (isPublished) {
                await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`);
                toast.success("Chapter unpublished ✨");

            }else{
                await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}/publish`);
                toast.success("Chapter published ✨");
            }

            router.refresh();
        } catch (error) {
            toast.error("Ops! something went wrong!")
        } finally {
            setIsLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
            toast.success("Chapter deleted ✨");
            router.push(`/teacher/courses/${courseId}`);

        } catch (error) {
            toast.error("Ops! something went wrong!")
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-x-2">
            <Button onClick={onClick} disabled={disabled || isLoading} variant={"outline"} size={"sm"} >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size={"sm"} disabled={isLoading} >
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    )
}

export default ChapterActions