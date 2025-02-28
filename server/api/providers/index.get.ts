import { DecodedUserAuth } from "~/server/utils/DecodedUserAuth"

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
  
    const stores = await db
      .select()
      .from(tables.providers)
      .orderBy(tables.providers.description)
  
    return stores
})