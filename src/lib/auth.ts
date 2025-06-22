import { gql } from "graphql-request";
import bcrypt from "bcryptjs";
import { client } from "./client";

export type User = {
  id: string;
  email: string;
  password: string;
};

export async function register(email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 4);

  const mutation = gql`
    mutation RegisterUser($email: String!, $password: String!) {
      insert_users_one(object: { email: $email, password: $password }) {
        id
        email
        password
      }
    }
  `;

  return client.request(mutation, {
    email,
    password: hashedPassword,
  });
}

export async function login(email: string, password: string): Promise<boolean> {
  const query = gql`
    query LoginUser($email: String!) {
      users(where: { email: { _eq: $email } }) {
        id
        email
        password
      }
    }
  `;

  try {
    const res = await client.request<{ users: User[] }>(query, { email });

    const user = res.users[0];
    if (!user) return false;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return false;
    const token = crypto.randomUUID();
    localStorage.setItem("token", token);
    localStorage.setItem("user_id", user.id);

    return true;
  } catch (error) {
    console.error("Login failed:", error);
    return false;
  }
}
