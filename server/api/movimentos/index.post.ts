import { Movimento } from '~/core/Movimento'
import { DecodedUserAuth } from '~/server/utils/DecodedUserAuth'

interface inputBd {
    tipoMovimento: string
    produtoId: number
    tamanho: string
    descricao: string
    notaFiscal: string
    quantidade: number
    departamento: string
}

export default eventHandler(async (event) => {
    const body = await readBody<Movimento>(event)

    const result = Movimento.safeParse(body)


    if (!result.success) { 
    
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request ' +  result.error.errors.map((error) => error.message).join(', '),

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

    const movimentos: inputBd [] = []
   
    for (const movimento of body.gradeQuantidade) {
        if(movimento.quantidade !== 0){
            
            movimentos.push({
                tipoMovimento: body.tipoMovimento,
                produtoId: body.produtoId,
                tamanho: movimento.tamanho,
                descricao: body.descricao,
                notaFiscal: body.notaFiscal,
                quantidade: body.tipoMovimento === 'Saida' ? movimento.quantidade * -1 : movimento.quantidade,
                departamento: userAuth.department,
            })
        }
    }

    for (const movimento of movimentos) {
       await db
            .insert(tables.movimentos)
            .values(movimento)
            .returning()
    }

  

    return {
        statusCode: 200,
        statusMessage: 'OK',
    }
})
