import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import { User, UserRole } from '~/core/Users'
import { validateEmail } from '~/utils/validateEmail'
import validatePassword from '~/utils/validatePassword'

interface Request {
    name?: string
    email?: string
    password?: string
    role?: UserRole
    department?: string
    patrimony?: boolean
    createdAt?: string
    updatedAt?: string
}

interface Decoded {
    userId: string
    role: string
    department: string
    patrimony: boolean
    iat: string
    exp: string
}

export default eventHandler(async (event) => {
    const cid = getRouterParam(event, 'id')
    const body = await readBody<Request>(event)

    const isAuthenticated = await authenticated(event)

    if (isAuthenticated?.statusCode) {
        throw createError({
            statusCode: isAuthenticated.statusCode,
            statusMessage: isAuthenticated.statusMessage,
        })
    }

    if (!cid) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
        })
    }

    const userAuth: Decoded = event.context.user

    if (!userAuth) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Acesso negado',
        })
    }

    const { email, password, role} = body


    if (role === 'admin' && userAuth.role !== 'admin') {
        throw createError({
            statusCode: 403,
            statusMessage: 'Acesso negado',
        })
    }

    if(email) {
        const isEmailValid = validateEmail(email)
        if (!isEmailValid) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Email Inválido',
            })
        }

    }

    

    if(password) {
        const isPasswordValid = validatePassword(password)
        if (!isPasswordValid) {
            throw createError({
                statusCode: 400,
                statusMessage:
                    'A senha deve conter no mínimo uma letra maiúscula, um número e um caractere especial',
            })
        }

    }

    const passwordHashed = password ?  await bcrypt.hash(password, 10) : null

    const db = useDatabase()
    if (!db) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
        })
    }

    delete body.createdAt
    delete body.updatedAt

    let newUser = {...body} as User

    if (passwordHashed) {
        newUser.password = passwordHashed
    }
    
    const user = await db.update(tables.users).set({...newUser, updatedAt: new Date()}).where(eq(tables.users.id, cid)).returning()
   

    return user.map((r) => ({
        ...r,
        password: undefined
    }))[0]
})
