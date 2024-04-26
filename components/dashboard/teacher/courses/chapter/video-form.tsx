"use client";
import FileUpload from "@/components/common/file-upload";
import { Button } from "@/components/ui/button";
import { MuxData } from "@prisma/client";
import axios from "axios";
import { ImageIcon, Pencil, PlusCircle, VideoIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import * as z from "zod";
import MuxPlayer from "@mux/mux-player-react";

interface VideoFormProps {
    videoUrl: string | null;
    courseId: string;
    chapterId: string;
    muxData?:MuxData|null;
}
const formSchema = z.object({
    videoUrl: z.string().min(1, {
        message: "Video is required!"
    }),
});

const VideoForm = (props: VideoFormProps) => {
    const { courseId, videoUrl,chapterId,muxData } = props;
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    const toggleEdit = () => {
        setIsEditing(prev => !prev);
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success("Video changed successfully✨");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong!");
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between ">
                Chapter video
                <Button variant={"ghost"} onClick={toggleEdit}>
                    {
                        isEditing &&
                        (
                            <>Cancel</>
                        )
                    }
                    {
                        !isEditing && videoUrl &&
                    (
                    <>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit video
                    </>
                    )
                    }
                    {
                        !isEditing && !videoUrl &&
                    (
                    <>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add a Video
                    </>
                    )
                    }
                </Button>
            </div>
            {
                !isEditing ?
                    (
                        !videoUrl ? (
                            <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                                <VideoIcon className="h-10 w-10 text-slate-500" />
                            </div>
                        ) : (
                            <div className="relative aspect-video mt-2">
                                <MuxPlayer playbackId={muxData?.playbackId || ""} />
                            </div>
                        )
                    )
                    :
                    (
                        <div className="">
                            <FileUpload endpoint="chapterVideo" onChange={(url)=>{
                                if (url) {
                                    onSubmit({videoUrl:url});
                                }
                            }}
                            />
                            <div className="text-xs text-muted-foreground mt-4">
                                Upload this chapter&apos;s video.
                            </div>
                        </div>
                    )
            }
            {
                videoUrl && !isEditing && (
                    <div className="text-xs text-muted-foreground mt-2">
                        Videos can take a few minutes to proccess. Refresh the page if video does not appear.
                    </div>
                )
            }
        </div>
    )
}

export default VideoForm