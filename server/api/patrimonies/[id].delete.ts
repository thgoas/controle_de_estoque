import { and, eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

export default eventHandler(async (event) => {
    const { id } = getRouterParams(event)

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
    try {
        const patrimony = await db
            .select()
            .from(tables.patrimonies)
            .where(eq(tables.patrimonies.id, id))
        const response = await db
            .delete(tables.patrimonies)
            .where(eq(tables.patrimonies.id, id))
            .returning()

        if (response.length > 0) {
            await db.insert(tables.historic).values({
                id: uuidv4(),
                patrimony_id: response[0].id,
                description: 'Deletado',
                type_historic: 'deleted',
                user_identification_id: userAuth.userId,
                entered_date: new Date().toISOString(),
                entered_sector_id: response[0].sector_id,
                entered_store_id: response[0].store_id,
                before_update: JSON.stringify(patrimony[0]),
            })
            const connections = await db
                .select()
                .from(tables.patrimoniesConnections)
                .where(eq(tables.patrimoniesConnections.patrimonyIdOne, id))
            for (const connection of connections) {
                if (connection.patrimonyIdOne && connection.patrimonyIdTwo) {
                    await db
                        .delete(tables.patrimoniesConnections)
                        .where(
                            and(
                                eq(
                                    tables.patrimoniesConnections
                                        .patrimonyIdOne,
                                    connection.patrimonyIdOne
                                ),
                                eq(
                                    tables.patrimoniesConnections
                                        .patrimonyIdTwo,
                                    connection.patrimonyIdTwo
                                )
                            )
                        )
                    await db
                        .delete(tables.patrimoniesConnections)
                        .where(
                            and(
                                eq(
                                    tables.patrimoniesConnections
                                        .patrimonyIdOne,
                                    connection.patrimonyIdTwo
                                ),
                                eq(
                                    tables.patrimoniesConnections
                                        .patrimonyIdTwo,
                                    connection.patrimonyIdOne
                                )
                            )
                        )
                }
            }
        }

        return response[0]
    } catch (e) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error' + ' ' + e,
        })
    }
})
