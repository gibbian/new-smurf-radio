import mysql from "mysql2/promise";

import { drizzle } from "drizzle-orm/mysql2";

import { env } from "~/env";
import * as schema from "./schema";

const connection = await mysql.createConnection({
  uri: env.DATABASE_URL
})

export const db = drizzle(
  connection,
  { schema, mode: "default" }
);
