import { Assets } from '~/core/Patrimony'
import { v4 as uuidv4 } from 'uuid'
import { eq } from 'drizzle-orm'
export default eventHandler(async (event) => {
    const body = await readBody<Assets>(event)

    const isAuthenticated = await authenticated(event)

    const result = Assets.safeParse(body)

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

    const assetsTypeExists = await db
        .select()
        .from(tables.assetsType)
        .where(eq(tables.assetsType.id, body.assetsTypeId))
        .limit(1)
    if (assetsTypeExists.length === 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request' + ' Tipo de ativo não existe',
        })
    }
    const assetsClassificationExists = await db
        .select()
        .from(tables.assetsClassification)
        .where(eq(tables.assetsClassification.id, body.assetsClassificationId))
        .limit(1)
    if (assetsClassificationExists.length === 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request' + ' Classificação do ativo não existe',
        })
    }
    const assetsExists = await db
        .select()
        .from(tables.assets)
        .where(eq(tables.assets.description, body.description))
        .limit(1)
    if (assetsExists.length > 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request' + ' Descrição já existe',
        })
    }
    const id = uuidv4()

    const newAssets: Assets = {
        description: body.description,
        assetsTypeId: body.assetsTypeId,
        assetsClassificationId: body.assetsClassificationId,
       
        
    }

    const newAssetsSubgroupAssets = body.assetsSubgroupAssets?.map((asset) => ({
        assetsId: id,
        assetsSubgroupId: asset.assetsSubgroupId,
    }))

    try {
        const response = await db
            .insert(tables.assets)
            .values({id, ...newAssets})
            .returning()
    
        if (
            newAssetsSubgroupAssets &&
            newAssetsSubgroupAssets?.length > 0 && response.length > 0
        ) {
           
            for (const asset of newAssetsSubgroupAssets) {
            
                await db.insert(tables.assetsSubgroupAssets).values(asset)
            }
        }

        const assets = await db
            .select()
            .from(tables.assets)
            .where(eq(tables.assets.id, response[0].id)).limit(1)

        const assetsSubgroupAssets = await db.select().from(tables.assetsSubgroupAssets).where(eq(tables.assetsSubgroupAssets.assetsId, assets[0].id))
        return {
            ...assets[0],
            assetsSubgroupAssets: assetsSubgroupAssets,
        }

        
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error' + error,
        })
    }
})
