"use client";
import FileUpload from "@/components/common/file-upload";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            imageUrl: imageUrl || "",
        },
    });
    const { isSubmitting, isValid } = form.formState;

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