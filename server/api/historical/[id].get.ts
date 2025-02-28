import { aliasedTable, desc, eq } from "drizzle-orm"


export default eventHandler(async (event) => {
   const isAuthenticated = await authenticated(event)
   const { id } = getRouterParams(event)
   
       if (isAuthenticated?.statusCode) {
           throw createError({
               statusCode: isAuthenticated.statusCode,
               statusMessage: isAuthenticated.statusMessage,
           })
       }
   
       const userAuth: DecodedUserAuth = event.context.user
       if(!userAuth.patrimony) {
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

       const enteredSector = aliasedTable(tables.sectors, 'entered_sector')
       const itWentOutSector = aliasedTable(tables.sectors, 'it_went_out_sector')
       const enteredStore = aliasedTable(tables.stores, 'entered_store')
       const itWentOutStore = aliasedTable(tables.stores, 'it_went_out_store')
     
       const response = await db.select({
           id: tables.historic.id,
           description: tables.historic.description,
           type_historic: tables.historic.type_historic,
           it_went_out_store: itWentOutStore.description,
           entered_store: enteredStore.description,
           it_went_out_sector: itWentOutSector.description,
           entered_sector:enteredSector.description,
           it_went_out_date: tables.historic.it_went_out_date,
           entered_date: tables.historic.entered_date,
           user: tables.users.name,
           createdAt: tables.historic.createdAt,
           before_update: tables.historic.before_update,
           after_update: tables.historic.after_update
           
       })
       .from(tables.historic)
       .where(eq(tables.historic.patrimony_id, id))
       .leftJoin(tables.patrimonies, eq(tables.historic.patrimony_id, tables.patrimonies.id))
       .leftJoin(enteredStore  , eq(tables.historic.entered_store_id, enteredStore.id))
       .leftJoin(itWentOutStore, eq(tables.historic.it_went_out_store_id, itWentOutStore.id))
       .leftJoin(enteredSector, eq(tables.historic.entered_sector_id, enteredSector.id))
       .leftJoin(itWentOutSector, eq(tables.historic.it_went_out_sector_id, itWentOutSector.id))
       .leftJoin(tables.users, eq(tables.historic.user_identification_id, tables.users.id))
       .orderBy(desc(tables.historic.createdAt))  
       return response
})