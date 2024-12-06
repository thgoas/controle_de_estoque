import { eq } from "drizzle-orm"
import { IUserLogged } from "~/core/Users"

interface Decoded {
    userId: string
    role: string
    department: string 
    iat: string
    exp: string
}

export default eventHandler(async (event) => {
    const isAuthenticated = await authenticated(event)

    if (isAuthenticated?.statusCode) {
        throw createError ({
            statusCode: isAuthenticated.statusCode,
            statusMessage: isAuthenticated.statusMessage
        })
    }

    const userAuth: Decoded = event.context.user
    
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

    const user = await db
      .select()
      .from(tables.users)
      .where(eq(tables.users.id, userAuth.userId))
      .limit(1)

    if (!user) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Acesso negado',
      })
    }

    const result: IUserLogged = {
        id: user[0].id,
        name: user[0].name!,
        email: user[0].email!,
        role: user[0].role!,
        department: user[0].department!,
        status: user[0].status!,
        token: ''
    }
    
    return result
})