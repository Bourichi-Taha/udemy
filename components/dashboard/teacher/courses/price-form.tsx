"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface PriceFormProps {
    price: number|null;
    courseId: string;
}
const formSchema = z.object({
    price: z.coerce.number(),
});

const PriceForm = (props: PriceFormProps) => {
    const { courseId,price } = props;
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    const toggleEdit = () => {
        setIsEditing(prev => !prev);
    }
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price: price || undefined,
        },
    });
    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`,values);
            toast.success("Price changed successfully✨");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong!");
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between ">
                Course price
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
                                    Edit price
                                </>
                            )
                    }
                </Button>
            </div>
            {
                !isEditing ?
                (
                    <p className={cn("text-sm mt-2",!price && "text-slate-500 italic")}>
                        {price ? formatPrice(price) : "No price"}
                    </p>
                )
                :
                (
                    <Form {...form} >
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                            <FormField control={form.control} name="price" render={({field})=>(
                                <FormItem>
                                    <FormControl>
                                        <Input disabled={isSubmitting} type="number" step={0.01} placeholder="Set a Price for your course" {...field} />
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

export default PriceForm