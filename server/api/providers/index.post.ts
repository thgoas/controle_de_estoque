import { Provider } from "~/core/Patrimony"
import { v4 as uuidv4 } from 'uuid'
import { eq } from "drizzle-orm"
export default eventHandler(async (event) => {
        const body = await readBody<Provider>(event)
    

        const isAuthenticated = await authenticated(event)

        const result = Provider.safeParse(body)
        
            if (!result.success) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Bad Request ' + result.error.errors.map((error) => error.message).join(', '),
                    
                })
            }

        if (isAuthenticated?.statusCode) {
            throw createError({
                statusCode: isAuthenticated.statusCode,
                statusMessage: isAuthenticated.statusMessage,
            })
        }

        const userAuth: DecodedUserAuth = event.context.user
        
            if (!userAuth.patrimony) {
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

        const ProviderExists = await db
            .select()
            .from(tables.providers)
            .where(eq(tables.providers.cnpj, body.cnpj))
            .limit(1)
        if (ProviderExists.length > 0) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request' + ' CNPJ já cadastrado',
            })
        }

        try {
        const id  = uuidv4()
        const store = await db
            .insert(tables.providers)
            .values({...body, id})
            .returning()
    
        return store[0]
        } catch (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Internal Server Error' + error,
            })
        }
})