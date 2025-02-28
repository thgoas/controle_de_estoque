import {  sql } from 'drizzle-orm';


import { pgTable, text, integer, boolean, timestamp, serial, primaryKey, decimal, date } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: text('id').primaryKey(),
    name: text('name'),
    email: text('email').unique(),
    password: text('password'),
    role: text('role').default('user'),
    department: text('department'),
    patrimony: boolean('patrimony').default(false),
    status: boolean('status').default(true),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`),

})

export const department = pgTable('department', {
    id: text('id').primaryKey(),
    name: text('name').notNull().unique(),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`),
})

export const produtos = pgTable('produtos', {
    id: serial('id').primaryKey(),
    marca: text('marca').notNull(),
    cor: text('cor').notNull(),
    referencia: text('referencia').notNull().unique(),
    descricao: text('descricao').notNull(),
    complemento: text('complemento'),
    grade: text('grade').notNull(),
    modelo: text('modelo').notNull(),
    tipo: text('tipo').notNull(),
    departamento: text('departamento').notNull(),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`),
})

export const movimentos = pgTable('movimentos', {
    id: serial('id').primaryKey(),
    tipoMovimento: text('tipoMovimento').notNull(),
    produtoId: integer('produtoId').notNull(),
    tamanho: text('tamanho').notNull(),
    descricao: text('descricao').notNull(),
    notaFiscal: text('notaFiscal'),
    quantidade: integer('quantidade').notNull(),
    departamento: text('departamento').notNull(),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`),
})

export const assetsType = pgTable('assetsType', {
    id: text('id').primaryKey(),
    description: text('description').notNull(),
    status: boolean('status').default(true),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`),
})

export const assetsClassification = pgTable('assetsClassification', {
    id: text('id').primaryKey(),
    description: text('description').notNull(),
    status: boolean('status').default(true),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`),
})


export const assets = pgTable('assets', {
    id: text('id').primaryKey(),
    description: text('description').notNull(),
    assetsClassificationId: text('assetsClassificationId').notNull(),
    assetsTypeId: text('assetsTypeId').notNull(),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`),
})

export const assetsSubgroup = pgTable('assetsSubgroup', {
    id: text('id').primaryKey(),
    description: text('description').notNull(),
    status: boolean('status').default(true),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`),
})

export const assetsSubgroupAssets = pgTable('assetssubgroup_assets', {
    assetsSubgroupId: text('assetsSubgroupId'),
    assetsId: text('assetsId'),

}, (table) => [
    primaryKey({columns: [table.assetsSubgroupId, table.assetsId]}),
])

export const patrimonies = pgTable('patrimonies', {
    id: text('id').primaryKey(),
    description: text('description').notNull(),
    serial_number: text('serial_number'),
    assets_id: text('assets_id').notNull(),
    assets_subgroup_id: text('assets_subgroup_id').notNull(),
    store_id: text('store_id').notNull(),
    sector_id: text('sector_id').notNull(),
    invoice: text('invoice'),
    purchase_date: date('purchase_date'),
    price: decimal('price').notNull(),
    guarantee_date: date('guarantee_date'),
    low_date: date('low_date'),
    note: text('note'),
    people: text('people'),
    provider_id: text('provider_id'),
    status_id: text('status').notNull(),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`),
})

export const patrimoniesConnections = pgTable('patrimonies_connections', {
    patrimonyIdOne: text('patrimonyIdOne'),
    patrimonyIdTwo: text('patrimonyIdTwo'),
}, (table) => [
        primaryKey({columns: [table.patrimonyIdOne, table.patrimonyIdTwo]}),
])


export const status = pgTable('status', {
    id: text('id').primaryKey(),
    description: text('description').notNull(),
    status: boolean('status').default(true),
    color: text('color'),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`),
})
    


export const historic = pgTable('historic', {
    id: text('id').primaryKey(),
    patrimony_id: text('patrimony_id').notNull(),
    description: text('description').notNull(),
    type_historic: text('type_historic').notNull(),
    it_went_out_store_id: text('it_went_out_id'),
    entered_store_id: text('entered_store_id'),
    it_went_out_sector_id: text('it_went_out_sector_id'),
    entered_sector_id: text('entered_sector_id'),
    it_went_out_date: date('it_went_out_date'),
    entered_date: date('entered_date'),
    user_identification_id: text('user_identification_id').notNull(),
    createdAt: timestamp('created_at').default(sql`now()`),
    before_update: text('before_update'),
    after_update: text('after_update'),
})

export const providers = pgTable('providers', {
    id: text('id').primaryKey(),
    description: text('description').notNull(),
    cnpj: text('cnpj').notNull(),
    address : text('address').notNull(),
    contact_name: text('contact_name'),
    phone: text('phone'),
    cep: text('cep'),
    status: boolean('status').default(true),
    email: text('email'),
    obs: text('obs'),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`),
})

export const sectors = pgTable('sectors', {
    id: text('id').primaryKey(),
    description: text('description').notNull(),
    status: boolean('status').default(true),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`),
})

export const stores = pgTable('stores', {
    id: text('id').primaryKey(),
    description: text('description').notNull(),
    cnpj: text('cnpj').notNull(),
    status: boolean('status').default(true),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`),
})
