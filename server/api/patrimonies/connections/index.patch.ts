import { and, eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { PatrimonyConnection } from '~/core/Patrimony'

export default eventHandler(async (event) => {
    const body = await readBody<PatrimonyConnection[]>(event)

    if (body.length === 0) {
        throw createError({
            statusCode: 400,
            statusMessage:
                'Bad Request ' + 'Não foi possível adicionar conexões',
        })
    }
    for (const connection of body) {
        const result = PatrimonyConnection.safeParse(connection)
        if (!result.success) {
            throw createError({
                statusCode: 400,
                statusMessage:
                    'Bad Request ' +
                    result.error.errors
                        .map((error) => error.message)
                        .join(', '),
            })
        }
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

    try {
        for (const item of body) {
            const { patrimonyIdOne, patrimonyIdTwo } = item
            if (item.status === 'delete') {
                await db
                    .delete(tables.patrimoniesConnections)
                    .where(
                        and(
                            eq(
                                tables.patrimoniesConnections.patrimonyIdOne,
                                patrimonyIdOne
                            ),
                            eq(
                                tables.patrimoniesConnections.patrimonyIdTwo,
                                patrimonyIdTwo
                            )
                        )
                    )
                await db
                    .delete(tables.patrimoniesConnections)
                    .where(
                        and(
                            eq(
                                tables.patrimoniesConnections.patrimonyIdOne,
                                patrimonyIdTwo
                            ),
                            eq(
                                tables.patrimoniesConnections.patrimonyIdTwo,
                                patrimonyIdOne
                            )
                        )
                    )
                await db.insert(tables.historic).values({
                    id: uuidv4(),
                    patrimony_id: patrimonyIdOne,
                    type_historic: 'disconnect',
                    description: `Desconectou ${patrimonyIdTwo}`,
                    user_identification_id: userAuth.userId,
                })
                await db.insert(tables.historic).values({
                    id: uuidv4(),
                    patrimony_id: patrimonyIdTwo,
                    type_historic: 'disconnect',
                    description: `Desconectou ${patrimonyIdOne}`,
                    user_identification_id: userAuth.userId,
                })
            } else if(item.status === 'new') {
                await db
                    .insert(tables.patrimoniesConnections)
                    .values({ patrimonyIdOne, patrimonyIdTwo })
                await db.insert(tables.patrimoniesConnections).values({
                    patrimonyIdOne: patrimonyIdTwo,
                    patrimonyIdTwo: patrimonyIdOne,
                })

                await db.insert(tables.historic).values({
                    id: uuidv4(),
                    patrimony_id: patrimonyIdOne,
                    type_historic: 'connect',
                    description: `Conectou ${patrimonyIdTwo}`,
                    user_identification_id: userAuth.userId,
                })
                await db.insert(tables.historic).values({
                    id: uuidv4(),
                    patrimony_id: patrimonyIdTwo,
                    type_historic: 'connect',
                    description: `Conectou ${patrimonyIdOne}`,
                    user_identification_id: userAuth.userId,
                })
            }
        }

        const response = await db
            .select()
            .from(tables.patrimonies)
            .orderBy(tables.patrimonies.id)
        const map = response.map(async (r) => {
            const patrimoniesConnections = await db
                .select()
                .from(tables.patrimoniesConnections)
                .where(eq(tables.patrimoniesConnections.patrimonyIdOne, r.id))

            return {
                ...r,
                patrimoniesConnections: patrimoniesConnections,
            }
        })
        return await Promise.all(map)
    } catch (e) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error ' + e,
        })
    }
})
