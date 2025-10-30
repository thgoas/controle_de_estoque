import { v4 } from 'uuid'
import { Image } from '~/core/Images'
import { DecodedUserAuth } from '~/server/utils/DecodedUserAuth'

export default eventHandler(async (event) => {
    const body = await readBody<Image[]>(event)

    const result = Image.safeParse(body)

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

    if (!userAuth) {
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

    for (const image of body) {
        if (!['image/png', 'image/jpeg'].includes(image.type)) {
            return createError({
                statusCode: 400,
                statusMessage: 'Apenas imagens PNG ou JPEG são permitidas',
            })
        }
        if (image.data.length > 10 * 1024 * 1024) {
            // Limite de 10MB
            return createError({
                statusCode: 400,
                statusMessage: 'A imagem deve ter menos de 10MB',
            })
        }

        const newImage = {
            id: v4(),
            name: image.name,
            type: image.type,
            data: image.data,
            product_id: image.product_id,
            patrimonies_id: image.patrimonies_id,
            historical_id: image.historical_id,
            user_id: userAuth.userId,
        }

        await db.insert(tables.images).values(newImage).returning()
    }

    return { message: 'Imagens cadastradas com sucesso' }
})
