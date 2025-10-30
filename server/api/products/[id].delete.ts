import { eq } from 'drizzle-orm'
import { DecodedUserAuth } from '~/server/utils/DecodedUserAuth'

export default eventHandler(async (event) => {

    const cid = getRouterParam(event, 'id')
   
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

    
    if (userAuth.role !== 'admin') {
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
        const produtos = await db
            .delete(tables.produtos)
            .where(eq(tables.produtos.id, Number(cid)))
            .returning()
        if(produtos.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Product not found',
            })
        }
        
        await db.delete(tables.images)
            .where(eq(tables.images.product_id, Number(cid)))   
            
        await db.delete(tables.movimentos).where(eq(tables.movimentos.produtoId, Number(cid)))    
    
        return produtos[0]

    } catch (error) {
        console.error('Error deleting product:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
        })
    }
})
