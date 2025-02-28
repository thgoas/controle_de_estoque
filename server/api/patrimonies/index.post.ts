import { Patrimony } from '~/core/Patrimony'
import { v4 as uuidv4 } from 'uuid'
import { eq } from 'drizzle-orm'
export default eventHandler(async (event) => {
    const body = await readBody<Patrimony>(event)

    const isAuthenticated = await authenticated(event)

    const result = Patrimony.safeParse(body)

    if (!result.success) {
        throw createError({
            statusCode: 400,
            statusMessage:
                'Bad Request ' +
                result.error.errors.map((error) => error.message).join(', '),
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

    const patrimonyExists = await db
        .select()
        .from(tables.patrimonies)
        .where(eq(tables.patrimonies.id, body.id!))
        .limit(1)
    if (patrimonyExists.length > 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request' + ' Patrimonio já existe',
        })
    }

    const newPatrimony = {
        id: body.id,
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
        const response = await db
            .insert(tables.patrimonies)
            .values({
                ...newPatrimony
                
            })
            .returning()

        if (response.length > 0) {
            await db.insert(tables.historic).values({
                id: uuidv4(),
                patrimony_id: response[0].id,
                description: 'Criado',
                type_historic: 'created',
                user_identification_id: userAuth.userId,
                entered_date: new Date().toISOString(),
                entered_sector_id: response[0].sector_id,
                entered_store_id: response[0].store_id   
            })
        }            
        const connections = await db.select().from(tables.patrimoniesConnections).where(eq(tables.patrimoniesConnections.patrimonyIdOne, response[0].id))
            return { ...response[0], patrimoniesConnections: connections }
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error' + error,
        })
    }
})
