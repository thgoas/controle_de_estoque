export default eventHandler(async (event) => {

    const isAuthenticated = await authenticated(event)

    if (isAuthenticated?.statusCode) {
        throw createError({
            statusCode: isAuthenticated.statusCode,
            statusMessage: isAuthenticated.statusMessage,
        })
    }
    const db = useDatabase()
    if (!db) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
      })
    }
  
    const departments = await db
      .select()
      .from(tables.department)
      .orderBy(tables.department.name)
  
    return departments
})