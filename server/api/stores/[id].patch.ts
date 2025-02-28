import { eq } from "drizzle-orm"
import { Store } from "~/core/Patrimony"

export default eventHandler(async (event) => {
    const { id } = getRouterParams(event)
    const body = await readBody<Store>(event)

    const result = Store.safeParse(body)

    if (!result.success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request ' + result.error.errors
                .map((error) => error.message)
                .join(', '),
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

    const newStore: Store = {
        description: body.description,
        cnpj: body.cnpj,
        status: body.status
    } 

    try {

        const store = await db
            .update(tables.stores)
            .set({...newStore, updatedAt: new Date()})
            .where(eq(tables.stores.id, id))
            .returning()
    
        return store[0]
    }catch (e) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error ' + e,
        })
    }
})