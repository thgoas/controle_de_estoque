import { eq } from "drizzle-orm"

export default eventHandler(async (event) => {
    const pid = getRouterParam(event, 'productId')

    if (!pid) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
        })
    }

    const isAuthenticated = await authenticated(event)

    if (isAuthenticated?.statusCode) {
        throw createError({
            statusCode: isAuthenticated.statusCode,
            statusMessage: isAuthenticated.statusMessage,
        })
    }

    const userAuth: DecodedUserAuth = event.context.user
    const db = useDatabase()
    if (!db) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
      })
    }

    const movimentos = await db
      .select()
      .from(tables.movimentos)
      .where(eq(tables.movimentos.produtoId, Number(pid)))
      .orderBy(tables.movimentos.createdAt)
  
    return movimentos
})