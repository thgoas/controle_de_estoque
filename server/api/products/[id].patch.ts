import { eq } from 'drizzle-orm'
import { Product } from '~/core/Product'

import { DecodedUserAuth } from '~/server/utils/DecodedUserAuth'

export default eventHandler(async (event) => {

    const cid = getRouterParam(event, 'id')
    const body = await readBody<Product>(event)

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

    const department = await db
        .update(tables.produtos)
        .set({ ...newProduct, updatedAt: new Date() })
        .where(eq(tables.produtos.id, Number(cid)))
        .returning()

    return department[0]
})
