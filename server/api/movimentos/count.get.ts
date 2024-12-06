import { eq, sum } from "drizzle-orm"
import { Movimento, MovimentoCount } from "~/core/Movimento"

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
    const response = await db
      .select({
        id: tables.produtos.id,
        produto: tables.produtos.descricao,
        grade: tables.produtos.grade,
        tamanho: tables.movimentos.tamanho,
        quantidade: sum (tables.movimentos.quantidade)
      })
      .from(tables.produtos)
      .leftJoin(tables.movimentos, eq(tables.produtos.id, tables.movimentos.produtoId))
      .where(eq(tables.produtos.departamento, userAuth.department))
      .groupBy(tables.produtos.id, tables.produtos.descricao,tables.produtos.grade, tables.movimentos.tamanho)
      .orderBy(tables.produtos.descricao)
    
    

    const reduced = response.reduce((acc, item) => {
        const { id, produto, grade, tamanho, quantidade } = item;
        const existingItem = acc.find((i: any) => i.produto === produto);
        if (existingItem) {
          existingItem.quantidade += Number(quantidade);
        } else {
          acc.push({ id, produto, grade, tamanho, quantidade: Number(quantidade) });
        }
        return acc;
    },[]as any[]);  

    const map = reduced.map((item) => {
      const tamanho = response.filter((f) => f.produto === item.produto).map((i) => {
        return {
          tamanho: i.tamanho ? i.tamanho : 'Sem Movimento',
          quantidade: i.quantidade ? i.quantidade : 0
        }
      }).sort((a, b) => {
        if (Number(a.tamanho)) {
          return Number(a.tamanho) - Number(b.tamanho)
        } else {
          return b.tamanho.localeCompare(a.tamanho)
        }
      })
      
      
      
        return {
            id: item.id,
            produto: item.produto,
            grade: item.grade.split(','),
            gradeQuantidade: tamanho,
            total: item.quantidade
        }
    })

  
      
    return map
})