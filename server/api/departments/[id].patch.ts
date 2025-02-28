import { eq } from 'drizzle-orm'
import { Department } from '~/core/Department'
import { DecodedUserAuth } from '~/server/utils/DecodedUserAuth'

export default eventHandler(async (event) => {

    const cid = getRouterParam(event, 'id')
    const body = await readBody<Department>(event)

    const result = Department.safeParse(body)

    if (!result.success) { 
    
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request ' + result.error.errors.map((error) => error.message).join(', '),

        })
    }

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

    const { name } = body
    
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
        .update(tables.department)
        .set({ name, updatedAt: new Date() })
        .where(eq(tables.department.id, cid))
        .returning()

    return department[0]
})
