"use client";

import { useCallback, useEffect, useState } from "react";
import { getTodos, deleteTodo, addTodo, updateTodo } from "@/lib/todos";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import dayjs from "dayjs";
import TodoModal from "../components/TodoModal";
import TodoCard from "../components/TodoCard";
import { Todo, CreateTodoInput, TodoForm } from "@/types/todo";

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const today = dayjs();

  const fetchTodos = useCallback(async () => {
    const data = await getTodos();
    setTodos(data);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      const confirmed = window.confirm(
        "Are you sure you want to delete this task?"
      );
      if (!confirmed) return;
      await deleteTodo(id);
      fetchTodos();
    },
    [fetchTodos]
  );

  const handleSave = useCallback(
    async (data: TodoForm) => {
      const input: CreateTodoInput = {
        ...data,
        completed: false,
      };

      if (isEditing && editingTodo) {
        await updateTodo(editingTodo.id, input);
      } else {
        await addTodo(input);
      }

      setShowModal(false);
      setEditingTodo(null);
      setIsEditing(false);
      fetchTodos();
    },
    [isEditing, editingTodo, fetchTodos]
  );

  const handleEdit = useCallback((todo: Todo) => {
    setIsEditing(true);
    setEditingTodo(todo);
    setShowModal(true);
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return (
    <div className="p-4 max-w-md mx-auto bg-[#f5f5f5] min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-3xl font-bold">{today.format("D")}</div>
          <div className="text-sm text-gray-600">{today.format("dddd")}</div>
          <div className="text-sm text-gray-600">
            {today.format("MMM YYYY")}
          </div>
        </div>
        <Button
          onClick={() => {
            setShowModal(true);
            setIsEditing(false);
            setEditingTodo(null);
          }}
          className="bg-white text-black px-4 py-2 flex items-center gap-2 border rounded-md transition hover:bg-gray-100"
        >
          <div className="bg-purple-600 text-white rounded-full p-1">
            <Plus className="w-4 h-4" />
          </div>
          <span className="uppercase font-semibold">New Task</span>
        </Button>
      </div>
      <div className="border-t border-dashed border-gray-400 my-4" />
      <h2 className="text-lg font-semibold mt-6 mb-2 text-center">
        TODO TASKS
      </h2>
      <div className="space-y-3">
        {todos
          .filter((todo) => !todo.completed)
          .map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onUpdateStatus={async (id) => {
                await updateTodo(id, {
                  priority_type: "done",
                  completed: true,
                });
                fetchTodos();
              }}
            />
          ))}
      </div>
      <div className="border-t border-dashed border-gray-400 my-4" />
      <h2 className="text-lg font-semibold mt-6 mb-2 text-center">
        DONE TASKS
      </h2>
      <div className="space-y-3">
        {todos
          .filter((todo) => todo.completed)
          .map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onUpdateStatus={async (id) => {
                await updateTodo(id, {
                  priority_type: "normal",
                  completed: false,
                });
                fetchTodos();
              }}
            />
          ))}
      </div>

      <TodoModal
        isOpen={showModal}
        isEditing={isEditing}
        initialData={
          isEditing && editingTodo
            ? {
                title: editingTodo.title,
                description: editingTodo.description,
                priority_type: editingTodo.priority_type,
              }
            : undefined
        }
        onSubmit={handleSave}
        onClose={() => {
          setShowModal(false);
          setIsEditing(false);
          setEditingTodo(null);
        }}
      />
    </div>
  );
}
