"use client";
import FileUpload from "@/components/common/file-upload";
import { Button } from "@/components/ui/button";
import { Attachment } from "@prisma/client";
import axios from "axios";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import * as z from "zod";

interface AttachementFormProps {
    attachments: Attachment[];
    courseId: string;
}
const formSchema = z.object({
    url: z.string().min(1),
});

const AttachementForm = (props: AttachementFormProps) => {
    const { courseId, attachments } = props;
    const [isEditing, setIsEditing] = useState(false);
    const [toDeleteId, setToDeleteId] = useState<string|null>(null);
    const router = useRouter();
    const toggleEdit = () => {
        setIsEditing(prev => !prev);
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`, values);
            toast.success("Attachments created successfully✨");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong!");
        }
    }

    const onDelete = async (id: string) => {
        try {
            setToDeleteId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success("Attachments deleted successfully✨");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong!");
        }finally{
            setToDeleteId(null);
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between ">
                Course attachments
                <Button variant={"ghost"} onClick={toggleEdit}>
                    {
                        isEditing &&
                        (
                            <>Cancel</>
                        )
                    }
                    {
                        !isEditing &&
                    (
                    <>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add an Attachment
                    </>
                    )
                    }
                </Button>
            </div>
            {
                !isEditing ?
                    (
                        <>
                            {attachments.length === 0 && (
                                <p className="text-sm mt-2 text-slate-500 italic">
                                    No attachments
                                </p>
                            )}
                            {
                                attachments.length !== 0 && (
                                    <div className="space-y-2">
                                        {
                                            attachments.map((attachment)=>(
                                                <div key={attachment.id} className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border rounded-md text-sky-700">
                                                    <File className="h-4 w-4 mr-2 flex-shrink-0" />
                                                    <p className="text-xs line-clamp-1">
                                                        {attachment.name}
                                                    </p>
                                                    {
                                                        toDeleteId === attachment.id && (
                                                            <div className="">
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            </div>
                                                        )
                                                    }
                                                    {
                                                        toDeleteId !== attachment.id && (
                                                            <button type="button" className="ml-auto hover:opacity-75 transition" onClick={()=>onDelete(attachment.id)}>
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                        )
                                                    }
                                                </div>
                                            ))
                                        }
                                    </div>
                                )
                            }
                        </>
                    )
                    :
                    (
                        <div className="">
                            <FileUpload endpoint="courseAttachment" onChange={(url)=>{
                                if (url) {
                                    onSubmit({url:url});
                                }
                            }}
                            />
                            <div className="text-xs text-muted-foreground mt-4">
                                Add anything your students might need to complete the course.
                            </div>
                        </div>
                    )
            }
        </div>
    )
}

export default AttachementForm