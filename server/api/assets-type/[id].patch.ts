import { eq } from "drizzle-orm"
import { AssetsType } from "~/core/Patrimony"

export default eventHandler(async (event) => {
    const { id } = getRouterParams(event)
    const body = await readBody<AssetsType>(event)

    const result = AssetsType.safeParse(body)

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

    const newAssetsTypes: AssetsType = {
        description: body.description,
        status: body.status
    } 

    try {

        const response = await db
            .update(tables.assetsType)
            .set({...newAssetsTypes, updatedAt: new Date()})
            .where(eq(tables.assetsType.id, id))
            .returning()
    
        return response[0]
    }catch (e) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error ' + e,
        })
    }
})