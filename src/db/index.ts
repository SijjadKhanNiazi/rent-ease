import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is missing.");
}

// Fix for local environments utilizing serverless drivers for migrations
if (process.env.NODE_ENV === "development") {
  // Configures the serverless driver to use standard web sockets when invoked via local Node terminal scripts
  neonConfig.fetchConnectionCache = true;
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
