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
    const db = useDatabase()
    if (!db) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
      })
    }
  
    const response = await db
      .select()
      .from(tables.movimentos)
      .where(eq(tables.movimentos.departamento, userAuth.department))
      .orderBy(tables.movimentos.descricao)
  
    return response
})