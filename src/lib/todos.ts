import { gql } from "graphql-request";
import { client } from "./client";
import { Todo, CreateTodoInput } from "@/types/todo";

export async function getTodos(): Promise<Todo[]> {
  const query = gql`
    query GetTodos {
      todos {
        id
        title
        description
        priority_type
        completed
      }
    }
  `;
  const data = await client.request<{ todos: Todo[] }>(query);
  return data.todos;
}

export async function addTodo(input: CreateTodoInput): Promise<Todo> {
  const mutation = gql`
    mutation AddTodo(
      $title: String!
      $description: String!
      $priority_type: String
      $completed: Boolean!
    ) {
      insert_todos_one(
        object: {
          title: $title
          description: $description
          priority_type: $priority_type
          completed: $completed
        }
      ) {
        id
        title
        description
        priority_type
        completed
      }
    }
  `;

  try {
    const data = await client.request<{ insert_todos_one: Todo }>(mutation, {
      ...input,
      completed: input.completed ?? false,
    });
    return data.insert_todos_one;
  } catch (error) {
    console.error("Failed to create todo:", error);
    throw error;
  }
}

export async function getTodoById(id: string): Promise<Todo> {
  const query = gql`
    query GetTodoById($id: uuid!) {
      todos_by_pk(id: $id) {
        id
        title
        description
        priority_type
        completed
      }
    }
  `;
  const data = await client.request<{ todos_by_pk: Todo }>(query, { id });
  if (!data.todos_by_pk) throw new Error("Todo not found");
  return data.todos_by_pk;
}

export async function updateTodo(
  id: string,
  input: Partial<CreateTodoInput>
): Promise<Todo> {
  const mutation = gql`
    mutation UpdateTodo($id: uuid!, $changes: todos_set_input!) {
      update_todos_by_pk(pk_columns: { id: $id }, _set: $changes) {
        id
        title
        description
        priority_type
        completed
      }
    }
  `;
  const data = await client.request<{ update_todos_by_pk: Todo }>(mutation, {
    id,
    changes: input,
  });
  return data.update_todos_by_pk;
}

export async function deleteTodo(id: string): Promise<Todo> {
  const mutation = gql`
    mutation DeleteTodo($id: uuid!) {
      delete_todos_by_pk(id: $id) {
        id
        title
        description
        priority_type
        completed
      }
    }
  `;
  const data = await client.request<{ delete_todos_by_pk: Todo }>(mutation, {
    id,
  });
  return data.delete_todos_by_pk;
}
