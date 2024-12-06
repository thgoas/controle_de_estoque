import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { eq } from 'drizzle-orm'

export default eventHandler(async (event) => {
    const body = await readBody(event)
    const { email, password } = body

    
    if (!email || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'E-mail e senha são obrigatórios',
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
        .where(eq(tables.users.email, email))

    if (!user[0]) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Credenciais inválidas',
        })
    }

    let isPasswordValid = false
    if (user[0].password) {
        isPasswordValid = await bcrypt.compare(password, user[0].password)
    }
    if (!isPasswordValid) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Credenciais inválidas',
        })
    }

    const token = jwt.sign(
        {
            userId: user[0].id,
            role: user[0].role,
            department: user[0].department,
        },
        process.env.JWT_SECRET!,
        { expiresIn: '1d' }
    )

    return { name: user[0].name, email: user[0].email, role: user[0].role, department: user[0].department, token }
})
