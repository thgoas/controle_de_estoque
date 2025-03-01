import { eq } from "drizzle-orm"
import { assets } from "~/server/database/schema"

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
         .from(tables.assets)
         .orderBy(tables.assets.description)
       
      const assetsSubGroups = await db.select().from(tables.assetsSubgroupAssets)
       const map = response.map((asset) => {
        const assetsSubgroupAssets = assetsSubGroups.filter(c => c.assetsId === asset.id)     
        return {
          ...asset,
          assetsSubgroupAssets: assetsSubgroupAssets
        }
       })
       return map

})