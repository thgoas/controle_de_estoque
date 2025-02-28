import { AssetsType } from "~/core/Patrimony"
import { v4 as uuidv4 } from 'uuid'
import { eq } from "drizzle-orm"
export default eventHandler(async (event) => {
        const { description, status } = await readBody<AssetsType>(event)
    
        const isAuthenticated = await authenticated(event)

        const result = AssetsType.safeParse({ description, status })
        
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

        const assetsTypeExists = await db
            .select()
            .from(tables.assetsType)
            .where(eq(tables.assetsType.description, description))
            .limit(1)
        if (assetsTypeExists.length > 0) {
            
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request' + ' Descrição já existe',
            })
        }

        try {
        const id  = uuidv4()
        const response = await db
            .insert(tables.assetsType)
            .values({id, description, status })
            .returning()
    
        return response[0]
        } catch (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Internal Server Error' + error,
            })
        }
})