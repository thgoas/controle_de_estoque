import bcrypt  from 'bcrypt'
import { eq, is } from 'drizzle-orm'
import {v4} from 'uuid'
import { User, UserRole } from "~/core/Users"
import { validateEmail } from '~/utils/validateEmail'
import validatePassword from '~/utils/validatePassword'

interface Request {
    name: string
    email: string
    password: string
    role: UserRole | UserRole.USER
    department: string
    patrimony: boolean
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
    const body = await readBody<Request>(event)
    
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

  
    const {name, email, password, role, department, patrimony} = body

    if (!name || !email || !password) { 
        throw createError({
            statusCode: 400,
            statusMessage: 'Name, email e senha são obrigatórios',
        })
    }


    if(role === 'admin' && userAuth.role !== 'admin') {
        throw createError({
            statusCode: 403,
            statusMessage: 'Acesso negado',
        })
    }

    const isEmailValid = validateEmail(email)
    if (!isEmailValid) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Email Inválido',
        })
    }

    const isPasswordValid = validatePassword(password)
    if (!isPasswordValid) {
        throw createError({
            statusCode: 400,
            statusMessage: 'A senha deve conter no mínimo uma letra maiúscula, um número e um caractere especial',
        })
    }

    const passwordHashed = await bcrypt.hash(password, 10)
    
        const db = useDatabase()
        if (!db) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
        })
        }

   
    const userRequest = await db.select().from(tables.users).where(eq(tables.users.email, email))

    if(userRequest[0]?.id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Esse email já existe',
        })
    }

    const newUser = {
        id: v4(),
        name: name,
        email: email,
        password: passwordHashed,
        role: role,
        department: department,
        status: true,
        patrimony: patrimony
    }


    const user = await db.insert(tables.users).values(newUser).returning()

    return user.map(r => ({
        ...r,
        password: undefined
    }))[0]
})