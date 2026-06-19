import postgres from "postgres";
import * as schema from "./schema.js";
import { drizzle } from "drizzle-orm/postgres-js";
import { readConfig } from "src/config/config.js";

const config = readConfig();
const connection = postgres(config.dbUrl);
const db = drizzle(connection, { schema });

export default db;
