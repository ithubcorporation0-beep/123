"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Grip, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { toast } from "sonner";

interface Chapter {
  id: string;
  title: string;
  isPublished: boolean;
  isFree: boolean;
  position: number;
}

interface ChapterListProps {
  items: Chapter[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
  courseId: string;
}

export function ChapterList({
  items,
  onReorder,
  onEdit,
  courseId,
}: ChapterListProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState(items);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setChapters(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const itemsCopy = Array.from(chapters);
    const [reorderedItem] = itemsCopy.splice(result.source.index, 1);
    itemsCopy.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedChapters = itemsCopy.slice(startIndex, endIndex + 1);

    setChapters(itemsCopy);

    const bulkUpdateData = updatedChapters.map((chapter) => ({
      id: chapter.id,
      position: itemsCopy.findIndex((item) => item.id === chapter.id) + 1,
    }));

    onReorder(bulkUpdateData);
  };

  const onDelete = async (chapterId: string) => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/courses/${courseId}/chapters/${chapterId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete chapter");
      }

      toast.success("Chapter deleted!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
            {chapters.map((chapter, index) => (
              <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
                {(provided) => (
                  <div
                    className={`flex items-center gap-x-2 bg-muted/40 border border-muted-foreground/20 text-foreground rounded-xl mb-2 text-sm p-3 transition-colors ${
                      chapter.isPublished && "bg-primary/5 border-primary/20"
                    }`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className="px-1 py-1 rounded-lg hover:bg-muted cursor-grab active:cursor-grabbing text-muted-foreground transition"
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-4 w-4" />
                    </div>

                    <span className="font-semibold text-xs text-muted-foreground mr-1">
                      {index + 1}.
                    </span>

                    <span className="font-medium truncate flex-1">
                      {chapter.title}
                    </span>

                    <div className="ml-auto flex items-center gap-x-2">
                      {chapter.isFree && (
                        <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                          Free preview
                        </Badge>
                      )}

                      <Badge
                        variant={chapter.isPublished ? "default" : "outline"}
                        className="text-[10px] uppercase font-bold"
                      >
                        {chapter.isPublished ? "Published" : "Draft"}
                      </Badge>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-lg"
                        onClick={() => onEdit(chapter.id)}
                      >
                        <Pencil className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                      </Button>

                      <ConfirmModal
                        title="Delete this chapter?"
                        description="Are you sure you want to delete this chapter? This action cannot be undone."
                        confirmText="Delete Chapter"
                        onConfirm={() => onDelete(chapter.id)}
                        disabled={isDeleting}
                      >
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </ConfirmModal>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
