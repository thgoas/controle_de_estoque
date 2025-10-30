import { eq } from 'drizzle-orm'
import { v4 } from 'uuid'
import { Product } from '~/core/Product'

import { DecodedUserAuth } from '~/server/utils/DecodedUserAuth'

export default eventHandler(async (event) => {

    const cid = getRouterParam(event, 'id')
    const body = await readBody<Product>(event)
console.log(body)
    const result = Product.safeParse(body)

    if (!result.success) { 
    
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request ' +  result.error.errors.map((error) => error.message).join(', '),

        })
    }

    if (!cid) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
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

    const newProduct: Product = {
        cor: body.cor,
        descricao: body.descricao,
        marca: body.marca,
        modelo: body.modelo,
        referencia: body.referencia,
        grade: body.grade,
        tipo: body.tipo,
        complemento: body.complemento ? body.complemento : '',
    }

    let image

    if (body.image?.name && body.image?.type && body.image?.data) {
        if (!['image/png', 'image/jpeg'].includes(body.image.type)) {
            return createError({
                statusCode: 400,
                statusMessage: 'Apenas imagens PNG ou JPEG são permitidas',
            })
        }
        if (body.image.data.length > 10 * 1024 * 1024) {
            // Limite de 10MB
            return createError({
                statusCode: 400,
                statusMessage: 'A imagem deve ter menos de 10MB',
            })
        }

        image = {
            id: v4(),
            name: body.image.name,
            type: body.image.type,
            data: body.image.data,
            user_id: userAuth.userId,
        }
    }

    try {

    const response = await db
        .update(tables.produtos)
        .set({ ...newProduct, updatedAt: new Date() })
        .where(eq(tables.produtos.id, Number(cid)))
        .returning()
        
            let imageSave
        if(image !== undefined) {
          imageSave =  await db.insert(tables.images)
                .values({...image, product_id: Number(cid)})
                .onConflictDoUpdate({   
                    target: tables.images.product_id,
                    set: {
                        name: image.name,
                        type: image.type,
                        data: image.data,
                        user_id: image.user_id,
                    },
                }).returning()
        }

    return {...response[0] , image: imageSave ? imageSave[0] : null}
    } catch (error) {
        console.error('Error updating product:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
        })
    }
})
