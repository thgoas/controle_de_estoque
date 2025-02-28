import { and, eq } from 'drizzle-orm'
import { Assets } from '~/core/Patrimony'

export default eventHandler(async (event) => {
    const { id } = getRouterParams(event)
    const body = await readBody<Assets>(event)

    const result = Assets.safeParse(body)

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

    const newAssets: Assets = {
        description: body.description,
        assetsClassificationId: body.assetsClassificationId,
        assetsTypeId: body.assetsTypeId,
    }

    const assetsSubgroupAssets = body.assetsSubgroupAssets
    try {
        const response = await db
            .update(tables.assets)
            .set({ ...newAssets, updatedAt: new Date() })
            .where(eq(tables.assets.id, id))
            .returning()

        if(response.length > 0) {
            await db.delete(tables.assetsSubgroupAssets).where(and(eq(tables.assetsSubgroupAssets.assetsId, id)))
           if(assetsSubgroupAssets && assetsSubgroupAssets?.length > 0){
                for (const asset of assetsSubgroupAssets) {
                    await db.insert(tables.assetsSubgroupAssets).values(asset)
                }
              
           }
        }

        const assetsSubgroupAssetsResponse = await db.select().from(tables.assetsSubgroupAssets).where(eq(tables.assetsSubgroupAssets.assetsId,response[0].id))
        return {
            ...response[0],
            assetsSubgroupAssets: assetsSubgroupAssetsResponse,
        }
        
    } catch (e) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error ' + e,
        })
    }
})
