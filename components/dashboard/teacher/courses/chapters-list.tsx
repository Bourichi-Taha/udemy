"use client";

import { Chapter } from "@prisma/client";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { cn } from "@/lib/utils";
import { Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChaptersListProps {
    items: Chapter[];
    onEdit: (id:string) => void;
    onReorder: (arr:{id:string,position:number}[]) => void;
}

const ChaptersList = (props: ChaptersListProps) => {
    const { items, onEdit, onReorder } = props;
    const [isMounted, setIsMounted] = useState(false);
    const [chapters, setChapters] = useState<Chapter[]>(items);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setChapters(items);
    }, [items])

    if (!isMounted) {
        return null;
    }

    const onDragEnd = (result:DropResult) => {
        if (!result.destination) {
            return;
        }
        const dragItems = Array.from(chapters);
        const selectedItem = dragItems[result.source.index];

        const newIems=dragItems.filter((it)=>it.id!==selectedItem.id);
        const newetArr=newIems.slice(0, result.destination.index).concat(selectedItem, newIems.slice(result.destination.index));
        setChapters(newetArr)
        const bulkUpdateChapters = newetArr.map((chapter,index) => ({
            id:chapter.id,
            position:index+1
        }));
        onReorder(bulkUpdateChapters);
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="chapters">
                {
                    (provided) => (
                        <div className="" {...provided.droppableProps} ref={provided.innerRef}>
                            {
                                chapters.map((chapter, index) => (
                                    <Draggable key={chapter.id} draggableId={chapter.id} index={index} >
                                        {
                                            (provided) => (
                                                <div className={cn("flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm", chapter.isPublished && "bg-sky-100 border-sky-200 text-sky-700")} ref={provided.innerRef} {...provided.draggableProps}>
                                                    <div className={cn("px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition", chapter.isPublished && "border-r-sky-200 hover:bg-sky-200")} {...provided.dragHandleProps}>
                                                        <Grip className="h-5 w-5 " />
                                                    </div>
                                                    {
                                                        chapter.title
                                                    }
                                                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                                                        {chapter.isFree && (
                                                            <Badge>
                                                                Free
                                                            </Badge>
                                                        )}
                                                        <Badge className={cn("bg-slate-500", chapter.isPublished && "bg-sky-700")}>
                                                            {chapter.isPublished ? "Published" : "Draft"}
                                                        </Badge>
                                                        <Pencil className="w-4 h-4 cursor-pointer hover:opacity-75 transition" onClick={()=>onEdit(chapter.id)} />
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </Draggable>

                                ))
                            }
                            {provided.placeholder}
                        </div>
                    )
                }
            </Droppable>
        </DragDropContext>
    )
}

export default ChaptersList