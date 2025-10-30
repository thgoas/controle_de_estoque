import { eq } from "drizzle-orm"

export default eventHandler(async (event) => {

    const isAuthenticated = await authenticated(event)

    if (isAuthenticated?.statusCode) {
        throw createError({
            statusCode: isAuthenticated.statusCode,
            statusMessage: isAuthenticated.statusMessage,
        })
    }

    const userAuth: DecodedUserAuth = event.context.user
    const db = useDatabase()
    if (!db) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
      })
    }

    try {
  
    const products = await db
      .select()
      .from(tables.produtos)
      .where(eq(tables.produtos.departamento, userAuth.department))
      .orderBy(tables.produtos.descricao)
      const productsWithImages = []
      for (const product of products) {
        const images = await db
          .select()
          .from(tables.images)
          .where(eq(tables.images.product_id, product.id))  
          .limit(1)
        productsWithImages.push({
          ...product, 
          image: images[0]
        })
      }
      
    return productsWithImages
    } catch (error) {
      console.error('Error fetching products:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
        })
    }
})