import { eq } from "drizzle-orm"

export default eventHandler(async (event) => {
    const { id } = getRouterParams(event)

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
      .delete(tables.assets)
      .where(eq(tables.assets.id, id))

      await db.delete(tables.assetsSubgroupAssets).where(eq(tables.assetsSubgroupAssets.assetsId, id))
  
    return response
})