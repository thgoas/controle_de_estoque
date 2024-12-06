import { drizzle, type  NodePgDatabase } from 'drizzle-orm/node-postgres';

export * as tables from '~/server/database/schema';

let database: NodePgDatabase | null = null;

export const useDatabase = () => {
  const config = useRuntimeConfig();

  if (config.public.pgDbUrl) {
    database = drizzle(config.public.pgDbUrl);
  }

  return database;
};