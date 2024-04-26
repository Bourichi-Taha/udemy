"use client";
import Editor from "@/components/common/editor";
import Preview from "@/components/common/preview";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface DescriptionFormProps {
    description: string|null;
    courseId: string;
    chapterId:string;
}
const formSchema = z.object({
    description: z.string().min(1, {
        message: "Description is required!"
    }),
});

const DescriptionForm = (props: DescriptionFormProps) => {
    const { courseId,description,chapterId } = props;
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    const toggleEdit = () => {
        setIsEditing(prev => !prev);
    }
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: description || "",
        },
    });
    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`,values);
            toast.success("Description changed successfully✨");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong!");
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between ">
                Chapter description
                <Button variant={"ghost"} onClick={toggleEdit}>
                    {
                        isEditing ?
                            (
                                <>Cancel</>
                            )
                            :
                            (
                                <>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit description
                                </>
                            )
                    }
                </Button>
            </div>
            {
                !isEditing ?
                (
                    <div className={cn("text-sm mt-2",!description && "text-slate-500 italic")}>
                        {description ? (
                            <Preview value={description} />
                        ) : "No description"}
                    </div>
                )
                :
                (
                    <Form {...form} >
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                            <FormField control={form.control} name="description" render={({field})=>(
                                <FormItem>
                                    <FormControl>
                                        <Editor  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                            <div className="flex items-center gap-x-2">
                                <Button disabled={!isValid || isSubmitting} type={"submit"}>
                                    Save
                                </Button>
                            </div>
                        </form>
                    </Form>
                )
            }
        </div>
    )
}

export default DescriptionForm