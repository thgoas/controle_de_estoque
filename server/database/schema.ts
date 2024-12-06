import { sql } from 'drizzle-orm';

import { pgTable, text, integer, boolean, timestamp, serial } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: text('id').primaryKey(),
    name: text('name'),
    email: text('email').unique(),
    password: text('password'),
    role: text('role').default('user'),
    department: text('department'),
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


