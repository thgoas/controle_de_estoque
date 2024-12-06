import { drizzle, type  NodePgDatabase } from 'drizzle-orm/node-postgres';

export * as tables from '~/server/database/schema';

let database: NodePgDatabase | null = null;

export const useDatabase = () => {
  const { pgDBURL } = useRuntimeConfig();

  if (pgDBURL) {
    database = drizzle(process.env.DATABASE_URL!)
  }

  return database;
};