import { eq } from "drizzle-orm"
import { Provider } from "~/core/Patrimony"

export default eventHandler(async (event) => {
    const { id } = getRouterParams(event)
    const body = await readBody<Provider>(event)

    const result = Provider.safeParse(body)

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

    const newProvider: Provider = {
        description: body.description,
        cnpj: body.cnpj,
        address: body.address,
        contact_name: body.contact_name,
        phone: body.phone,
        cep: body.cep,
        status: body.status,
        obs: body.obs   
    } 

    try {

        const provider = await db
            .update(tables.providers)
            .set({...newProvider, updatedAt: new Date()})
            .where(eq(tables.providers.id, id))
            .returning()
    
        return provider[0]
    }catch (e) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error ' + e,
        })
    }
})