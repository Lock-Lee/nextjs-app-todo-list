"use client";

import { Check, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Todo } from "@/types/todo";
import { Checkbox } from "@radix-ui/react-checkbox";

export type Props = {
  todo: Todo;
  onEdit?: (todo: Todo) => void;
  onDelete?: (id: string) => void;
  onUpdateStatus?: (id: string) => void;
};

export default function TodoCard({
  todo,
  onEdit,
  onDelete,
  onUpdateStatus,
}: Props) {
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-orange-500 text-white";
      case "normal":
        return "bg-blue-500 text-white";
      case "done":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-200";
    }
  };

  return (
    <div
      onClick={() => onUpdateStatus?.(todo.id)}
      className={cn(
        "p-4 rounded-lg shadow flex justify-between items-start",
        getPriorityStyle(todo.priority_type)
      )}
    >
      <div>
        <div className="font-bold text-md">{todo.priority_type}</div>
        <div className="font-bold text-md">{todo.title}</div>
        <div className="text-sm">{todo.description}</div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex gap-2">
          <Pencil
            className="w-4 h-4 cursor-pointer"
            onClick={() => onEdit?.(todo)}
          />
          <Trash2
            className="w-4 h-4 cursor-pointer text-red-600"
            onClick={() => onDelete?.(todo.id)}
          />
        </div>
        <Checkbox
          checked={todo.priority_type === "done"}
          onCheckedChange={() => onUpdateStatus?.(todo.id)}
          className={cn(
            "w-6 h-6 rounded-full bg-white text-white border-none shadow flex items-center justify-center",
            "data-[state=checked]:bg-white"
          )}
        >
          {todo.priority_type === "done" && (
            <Check className="w-4 h-4 text-[#00c950]" />
          )}
        </Checkbox>
      </div>
    </div>
  );
}
