import { eq } from 'drizzle-orm'
import { Profile, ProfileName, ProfilePassword } from '~/core/Profile'
import bcrypt from 'bcrypt'

import { DecodedUserAuth } from '~/server/utils/DecodedUserAuth'
import validatePassword from '~/utils/validatePassword'
import { User } from '~/core/Users'

export default eventHandler(async (event) => {

    const cid = getRouterParam(event, 'id')
    const body = await readBody<Profile>(event)

    
    if (!cid) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
        })
    } else if (cid === 'name') {
       const result = ProfileName.safeParse(body)
        if (!result.success) { 
        
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: result.error.errors.map((error) => error.message).join(', '),
    
            })
        }
    } else if (cid === 'password') {
        const result = ProfilePassword.safeParse(body)
        if (!result.success) { 
        
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: result.error.errors.map((error) => error.message).join(', '),
    
            })
        }
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

    const { name, password, confirmePassword } = body


    if(cid === 'password' && password) {
        const isPasswordValid = validatePassword(password)
        if (!isPasswordValid) {
            throw createError({
                statusCode: 400,
                statusMessage:
                    'A senha deve conter no mínimo uma letra maiúscula, um número e um caractere especial',
            })
        }

    }
    
    if (cid === 'password' && password !== confirmePassword) {
        throw createError({
            statusCode: 400,
            statusMessage: 'As senhas não coincidem',
        })
    }
    
    


    const passwordHashed = password ?  await bcrypt.hash(password, 10) : null


   
    let newUser = password ? {
        password: passwordHashed,
        name,
    } : {
            
        name,

    }


     const db = useDatabase()
    if (!db) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
        })
    }

    const response = await db
        .update(tables.users)
        .set({ ...newUser, updatedAt: new Date() })
        .where(eq(tables.users.id, userAuth.userId))
        .returning()

    return response[0]
})
