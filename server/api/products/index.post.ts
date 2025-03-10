import { eq } from 'drizzle-orm'
import { Product } from '~/core/Product'
import { DecodedUserAuth } from '~/server/utils/DecodedUserAuth'

export default eventHandler(async (event) => {
    const body = await readBody<Product>(event)

    const result = Product.safeParse(body)

    if (!result.success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request ' + result.error.errors
                .map((error) => error.message)
                .join(', '),
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

    const product: Product = {
        cor: body.cor,
        marca: body.marca,
        referencia: body.referencia,
        descricao: body.descricao,
        complemento: body.complemento,
        grade: body.grade,
        tipo: body.tipo,
        modelo: body.modelo,
    }
    const productExist = await db.select().from(tables.produtos).where(eq(tables.produtos.referencia, body.referencia!))
    if (productExist.length > 0) {
        throw createError({
            statusCode: 400,
            statusMessage: `Produto com a referencia ${product.referencia} já cadastrado`,
        })
    }
    try {
        const response = await db
            .insert(tables.produtos)
            .values({ ...product, departamento: userAuth.department })
            .returning()

        return response[0]
    } catch (error) {
        console.log(error)
        throw createError({
            statusCode: 500,
            statusMessage: 'error',
        })
    }
})
