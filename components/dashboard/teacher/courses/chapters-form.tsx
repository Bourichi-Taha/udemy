"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chapter } from "@prisma/client";
import axios from "axios";
import { Loader2, Pencil, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import ChaptersList from "./chapters-list";

interface ChaptersFormProps {
    chapters: Chapter[] | null;
    courseId: string;
}
const formSchema = z.object({
    title: z.string().min(1, {
        message: "Chapter's title is required!"
    }),
});

const ChaptersForm = (props: ChaptersFormProps) => {
    const { courseId, chapters } = props;
    const [isUpdating, setIsUpdating] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();
    const toggleCreating = () => {
        setIsCreating(prev => !prev);
    }
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    });
    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters`, values);
            toast.success("Chapter created successfully✨");
            toggleCreating();
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong!");
        }
    }

    const onReorder = async(data:{id:string,position:number}[]) => {
        try {
            setIsUpdating(true);
            await axios.put(`/api/courses/${courseId}/chapters/reorder`,{data});
            toast.success("Chapters updated successfully✨");
        } catch (error) {
            toast.error("Something went wrong!");
        }finally{
            setIsUpdating(false);
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4 relative">
            {
                isUpdating && (
                    <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
                        <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
                    </div>
                )
            }
            <div className="font-medium flex items-center justify-between ">
                Course chapters
                <Button variant={"ghost"} onClick={toggleCreating}>
                    {
                        isCreating ?
                            (
                                <>Cancel</>
                            )
                            :
                            (
                                <>
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Add a chapter
                                </>
                            )
                    }
                </Button>
            </div>
            {
                isCreating &&
                    (
                        <Form {...form} >
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                                <FormField control={form.control} name="title" render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input disabled={isSubmitting} placeholder="e.g 'Introduction to course'" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <Button disabled={!isValid || isSubmitting} type={"submit"}>
                                    Create
                                </Button>
                            </form>
                        </Form>
                    )
            }
            {
                !isCreating && (
                    <div className={cn("text-sm mt-2",!chapters?.length && "text-slate-500 italic")}>
                        {
                            !chapters?.length ? "No chapters." : (
                                <ChaptersList onEdit={()=>{}} onReorder={onReorder} items={chapters} />
                            )
                        }
                    </div>
                )
            }
            {
                !isCreating && (
                    <p className="text-xs text-muted-foreground mt-4">
                        Drag and drop to reorder the chapters.
                    </p>
                )
            }

        </div>
    )
}

export default ChaptersForm