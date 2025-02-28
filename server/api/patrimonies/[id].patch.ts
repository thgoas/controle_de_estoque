import { and, eq } from 'drizzle-orm'
import { Patrimony } from '~/core/Patrimony'
import {v4 as uuidv4} from 'uuid'
import { status } from '~/server/database/schema'

export default eventHandler(async (event) => {
    const { id } = getRouterParams(event)
    const body = await readBody<Patrimony>(event)

    const result = Patrimony.safeParse(body)

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
        description: body.description,
        serial_number: body.serial_number,
        assets_id: body.assets_id,
        assets_subgroup_id: body.assets_subgroup_id,
        store_id: body.store_id,
        sector_id: body.sector_id,
        invoice: body.invoice,
        purchase_date: body.purchase_date,
        price: String(body.price),
        guarantee_date: body.guarantee_date,
        low_date: body.low_date,
        note: body.note,
        people: body.people,
        provider_id: body.provider_id,
        status_id: body.status_id,
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
                    description: 'Atualizado',
                    type_historic: 'updated',
                    user_identification_id: userAuth.userId,
                    entered_date: new Date().toISOString(),
                    entered_sector_id: response[0].sector_id,
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
