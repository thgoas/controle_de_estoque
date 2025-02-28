import { eq } from "drizzle-orm"


export default eventHandler(async (event) => {
   const isAuthenticated = await authenticated(event)
   
       if (isAuthenticated?.statusCode) {
           throw createError({
               statusCode: isAuthenticated.statusCode,
               statusMessage: isAuthenticated.statusMessage,
           })
       }
   
       const userAuth: DecodedUserAuth = event.context.user
       if(!userAuth.patrimony) {
           throw createError({
               statusCode: 403,
               statusMessage: 'Acesso negado',
           })
       }
       const db = useDatabase()
       if (!db) {
         throw createError({
           statusCode: 500,
           statusMessage: 'Internal Server Error',
         })
       }
     
       const response = await db
         .select()
         .from(tables.patrimonies)
         .orderBy(tables.patrimonies.id)
       const map = response.map(async (r) => {
        const patrimoniesConnections = await db.select().from(tables.patrimoniesConnections).where(eq(tables.patrimoniesConnections.patrimonyIdOne, r.id))
      
        return {
          ...r,
          patrimoniesConnections: patrimoniesConnections
        }
       })
       return  await Promise.all(map)

})