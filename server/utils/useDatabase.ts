import { drizzle, type  NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';
export * as tables from '~/server/database/schema'
let database: NodePgDatabase | null = null;


export const useDatabase = () => {
  const config = useRuntimeConfig();
  const pool = new pg.Pool({
    connectionString: config.public.pgDbUrl,
    max:10,
    
  });

  if (config.public.pgDbUrl) {
    database = drizzle({client: pool});
  }

  return database;
};

// export const useDatabase = () => {
//   const config = useRuntimeConfig();

//   if (config.public.pgDbUrl) {
//     database = drizzle(config.public.pgDbUrl);
//   }

//   return database;
// };