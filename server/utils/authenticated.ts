import jwt from 'jsonwebtoken'
export const authenticated = async (event: any) => {
    const authHeader = getHeader(event, 'authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //   throw createError({
    //     statusCode: 401,
    //     statusMessage: 'Token não fornecido ou malformado',
    //   })

      return {
        statusCode: 401,
        statusMessage: 'Token não fornecido ou malformado',
      }
      // setResponseStatus(event, 302)
      // setResponseHeader(event, 'Location', '/auth/login')
      // return
    }
  
    const token = authHeader.split(' ')[1]
  
    try {
      const secretKey = useRuntimeConfig().public.jwtSecret 
      const decoded = jwt.verify(token, secretKey)
  
      event.context.user = decoded
  
    } catch (error) {
    //   throw createError({
    //     statusCode: 401,
    //     statusMessage: 'Token inválido ou expirado',
    //   })
      // setResponseStatus(event, 302)
      // setResponseHeader(event, 'Location', '/auth/login')
      return {
        statusCode: 401,
        statusMessage: 'Token inválido ou expirado',
      }
    }
}