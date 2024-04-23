"use client";
import FileUpload from "@/components/common/file-upload";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import * as z from "zod";

interface ImageFormProps {
    imageUrl: string | null;
    courseId: string;
}
const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "Image is required!"
    }),
});

const ImageForm = (props: ImageFormProps) => {
    const { courseId, imageUrl } = props;
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    const toggleEdit = () => {
        setIsEditing(prev => !prev);
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Image changed successfully✨");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong!");
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between ">
                Course image
                <Button variant={"ghost"} onClick={toggleEdit}>
                    {
                        isEditing &&
                        (
                            <>Cancel</>
                        )
                    }
                    {
                        !isEditing && imageUrl &&
                    (
                    <>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit image
                    </>
                    )
                    }
                    {
                        !isEditing && !imageUrl &&
                    (
                    <>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add an Image
                    </>
                    )
                    }
                </Button>
            </div>
            {
                !isEditing ?
                    (
                        !imageUrl ? (
                            <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                                <ImageIcon className="h-10 w-10 text-slate-500" />
                            </div>
                        ) : (
                            <div className="relative aspect-video mt-2">
                                <Image alt="Upload" fill className="object-cover rounded-md" src={imageUrl} />
                            </div>
                        )
                    )
                    :
                    (
                        <div className="">
                            <FileUpload endpoint="courseImage" onChange={(url)=>{
                                if (url) {
                                    onSubmit({imageUrl:url});
                                }
                            }}
                            />
                            <div className="text-xs text-muted-foreground mt-4">
                                16:9 aspect ratio recommended.
                            </div>
                        </div>
                    )
            }
        </div>
    )
}

export default ImageForm