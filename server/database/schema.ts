import { sql } from 'drizzle-orm';

import { pgTable, text, integer, boolean, timestamp, serial } from 'drizzle-orm/pg-core';

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
    assetsId: text('assetsId').notNull(),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`),
})

export const patrimonies = pgTable('patrimonies', {
    id: text('id').primaryKey(),
    description: text('description').notNull(),
    serial_number: text('serial_number'),
    assets_id: text('assets_id').notNull(),
    assets_subgroup_id: text('assets_subgroup_id').notNull(),
    store_id: text('store_id').notNull(),
    sector_id: text('sector_id').notNull(),
    invoice: text('invoice').notNull(),
    purchase_date: timestamp('purchase_date'),
    price: integer('price').notNull(),
    guarantee_date: timestamp('guarantee_date'),
    low_date: timestamp('low_date'),
    note: text('note'),
    people: text('people'),
    provider_id: text('provider_id'),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`),
})

export const historic = pgTable('historic', {
    id: text('id').primaryKey(),
    patrimonyId: text('patrimonyId').notNull(),
    description: text('description').notNull(),
    userIdentification_id: text('userIdentification_id').notNull(),
    movement_date: timestamp('movement_date').notNull(),
    createdAt: timestamp('created_at').default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`),
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
