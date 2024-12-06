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
  
    const products = await db
      .select()
      .from(tables.produtos)
      .where(eq(tables.produtos.departamento, userAuth.department))
      .orderBy(tables.produtos.descricao)
  
    return products
})