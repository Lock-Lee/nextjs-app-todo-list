import { GraphQLClient } from "graphql-request";

const HASURA_ENDPOINT = process.env.NEXT_PUBLIC_HASURA_ENDPOINT as string;
const HASURA_ADMIN_SECRET = process.env
  .NEXT_PUBLIC_HASURA_ADMIN_SECRET as string;

if (!HASURA_ENDPOINT || !HASURA_ADMIN_SECRET) {
  throw new Error("Missing HASURA config in environment variables");
}

export const client = new GraphQLClient(HASURA_ENDPOINT, {
  headers: {
    "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
  },
});
