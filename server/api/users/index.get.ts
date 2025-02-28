
interface Decoded {
    userId: string
    role: string
    department: string 
    patrimony: boolean
    iat: string
    exp: string
}

export default eventHandler(async (event) => {
    const isAuthenticated = await authenticated(event)

    if (isAuthenticated?.statusCode) {
        throw createError ({
            statusCode: isAuthenticated.statusCode,
            statusMessage: isAuthenticated.statusMessage
        })
    }

    const userAuth: Decoded = event.context.user
    
    if (!userAuth) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Acesso negado',
      })
    }

    if(userAuth.role !== 'admin') {
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

    const response = await db.select().from(tables.users)

    return response.map(r => ({
        ...r,
        password: undefined,
    }))
})