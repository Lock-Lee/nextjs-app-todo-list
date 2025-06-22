"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { TodoForm } from "@/types/todo";

type TodoModalProps = {
  isOpen: boolean;
  initialData?: Partial<TodoForm>;
  isEditing?: boolean;
  onSubmit: (data: TodoForm) => void;
  onClose: () => void;
};

export default function TodoModal({
  isOpen,
  initialData,
  isEditing = false,
  onSubmit,
  onClose,
}: TodoModalProps) {
  const { register, handleSubmit, reset, setValue } = useForm<TodoForm>();

  useEffect(() => {
    if (initialData) {
      setValue("title", initialData.title || "");
      setValue("description", initialData.description || "");
      setValue("priority_type", initialData.priority_type || "normal");
    } else {
      reset();
    }
  }, [initialData, reset, setValue]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
          onClick={() => {
            reset();
            onClose();
          }}
        >
          <X />
        </button>
        <h3 className="text-lg font-semibold mb-4">
          {isEditing ? "Edit Task" : "Create New Task"}
        </h3>
        <form
          onSubmit={handleSubmit((data) => {
            onSubmit(data);
            reset();
          })}
          className="space-y-4"
        >
          <Input
            placeholder="Title"
            {...register("title", { required: true })}
          />
          <Textarea placeholder="Description" {...register("description")} />
          <select
            {...register("priority_type")}
            className="w-full border border-gray-300 rounded p-2"
          >
            <option value="normal">Normal Priority</option>
            <option value="high">High Priority</option>
          </select>
          <Button type="submit" className="w-full bg-purple-600 text-white">
            {isEditing ? "Update" : "Save"}
          </Button>
        </form>
      </div>
    </div>
  );
}
