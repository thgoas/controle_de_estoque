import { eq } from 'drizzle-orm'
import { DecodedUserAuth } from '~/server/utils/DecodedUserAuth'

export default eventHandler(async (event) => {

    const cid = getRouterParam(event, 'id')
   
    if (!cid) {
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

    if (!userAuth) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Acesso negado',
        })
    }

    
    if (userAuth.role !== 'admin') {
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

    const department = await db
        .delete(tables.department)
        .where(eq(tables.department.id, cid))
        .returning()

    return department[0]
})
