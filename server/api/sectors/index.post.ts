import { Sector } from "~/core/Patrimony"
import { v4 as uuidv4 } from 'uuid'
import { eq } from "drizzle-orm"
export default eventHandler(async (event) => {
        const { description, status } = await readBody<Sector>(event)
    
        const isAuthenticated = await authenticated(event)

        const result = Sector.safeParse({ description, status })
        
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

        const sectorExists = await db
            .select()
            .from(tables.sectors)
            .where(eq(tables.sectors.description, description))
            .limit(1)
        if (sectorExists.length > 0) {
            
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request' + ' Descrição já existe',
            })
        }

        try {
        const id  = uuidv4()
        const sector = await db
            .insert(tables.sectors)
            .values({id, description, status })
            .returning()
    
        return sector[0]
        } catch (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Internal Server Error' + error,
            })
        }
})