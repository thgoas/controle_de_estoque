import { eq } from 'drizzle-orm'
import {  StatusData } from '~/core/Patrimony'
import {v4 as uuidv4} from 'uuid'




export default eventHandler(async (event) => {
    const { id } = getRouterParams(event)
    const body = await readBody<StatusData>(event)

    const result = StatusData.safeParse(body)

    if (!result.success) {

        throw createError({
            statusCode: 400,
            statusMessage:
                'Bad Request ' +
                result.error.errors.map((error) => error.message).join(', '),
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

    const newPatrimony = {
     
        status_id: body.status_id,
        low_date: body.date,
       
    }

    const newMovement = {
        description: body.description,
    }


    try {
        const patrimony = await db.select().from(tables.patrimonies).where(eq(tables.patrimonies.id, id))
        const response = await db
            .update(tables.patrimonies)
            .set({ ...newPatrimony, updatedAt: new Date() })
            .where(eq(tables.patrimonies.id, id))
            .returning()
            if (response.length > 0) {
                await db.insert(tables.historic).values({
                    id: uuidv4(),
                    patrimony_id: response[0].id,
                    type_historic: 'updated_status',
                    user_identification_id: userAuth.userId,
                    ...newMovement,
                    it_went_out_sector_id: patrimony[0].sector_id,
                    entered_sector_id: response[0].sector_id,
                    it_went_out_store_id: patrimony[0].store_id,
                    entered_store_id: response[0].store_id,
                    before_update: JSON.stringify(patrimony[0]),
                    after_update: JSON.stringify(response[0]),   
                })
            }         
       
            const patrimoniesConnections = await db.select().from(tables.patrimoniesConnections).where(eq(tables.patrimoniesConnections.patrimonyIdOne, response[0].id))
            return { ...response[0], patrimoniesConnections: patrimoniesConnections }  
       
    } catch (e) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error ' + e,
        })
    }
})
