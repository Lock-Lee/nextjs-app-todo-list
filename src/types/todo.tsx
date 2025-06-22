export type PriorityType = "high" | "normal" | "done";

export type Todo = {
  id: string;
  title: string;
  description: string;
  priority_type: PriorityType;
  completed: boolean;
};

export type CreateTodoInput = Omit<Todo, "id">;
export type TodoForm = Omit<CreateTodoInput, "completed">;
