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
       const map = response.map(async (asset) => {
        const assetsSubgroupAssets = await db.select().from(tables.assetsSubgroupAssets).where(eq(tables.assetsSubgroupAssets.assetsId, asset.id))
      
        return {
          ...asset,
          assetsSubgroupAssets: assetsSubgroupAssets
        }
       })
       return  await Promise.all(map)

})