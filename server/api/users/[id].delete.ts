
import { eq } from 'drizzle-orm'



interface Decoded {
    userId: string
    role: string
    department: string
    patrimony: boolean
    iat: string
    exp: string
}

export default eventHandler(async (event) => {
    const cid = getRouterParam(event, 'id')
    
    const isAuthenticated = await authenticated(event)

    if (isAuthenticated?.statusCode) {
        throw createError({
            statusCode: isAuthenticated.statusCode,
            statusMessage: isAuthenticated.statusMessage,
        })
    }

    if (!cid) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
        })
    }

    const userAuth: Decoded = event.context.user

    if (!userAuth) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Acesso negado',
        })
    }

 
   


    if ( userAuth.role !== 'admin') {
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
    
    
    
    
    
    
    const user = await db.delete(tables.users).where(eq(tables.users.id, cid)).returning()


    return user.map((r) => ({
        ...r,
        password: undefined
    }))[0]
})
