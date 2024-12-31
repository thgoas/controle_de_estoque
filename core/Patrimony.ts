import { z } from "zod";

export const Patrimony = z.object({
    id: z.number(),
    descricao: z.string().min(2, 'Deve conter pelo menos 2 caracteres'),
    serialNumber: z.string(),
    assetsId: z.string().min(1, 'Deve conter pelo menos 1 caracteres'),
    assetsSubgroupId: z.string().min(1, 'Deve conter pelo menos 1 caracteres'),
    storeId: z.string().min(1, 'Deve conter pelo menos 1 caracteres'),
    sectorId: z.string().min(1, 'Deve conter pelo menos 1 caracteres'),
    invoice: z.string().min(1, 'Deve conter pelo menos 1 caracteres'),
    purchaseDate: z.date(),
    price: z.number(),
    guaranteeDate: z.date(),
    lowDate: z.date(),
    note: z.string(),
})

export type Patrimony = z.infer<typeof Patrimony>

export const AssetsClassification = z.object({
    id: z.string().optional(),
    description: z.string().min(2, 'Deve conter pelo menos 2 caracteres'),
    status: z.boolean().default(true),
})

export type AssetsClassification = z.infer<typeof AssetsClassification>

export const AssetsSubgroup = z.object({
    id: z.string().optional(),
    description: z.string().min(2, 'Deve conter pelo menos 2 caracteres'),
    status: z.boolean().default(true),
})

export type AssetsSubgroup = z.infer<typeof AssetsSubgroup>

export const AssetsType = z.object({
    id: z.string().optional(),
    description: z.string().min(2, 'Deve conter pelo menos 2 caracteres'),
    status: z.boolean().default(true),
})

export type AssetsType = z.infer<typeof AssetsType>

export const Assets = z.object({
   id: z.number().optional(),
   description: z.string().min(2, 'Deve conter pelo menos 2 caracteres'),
   assetsClassificationId: z.string().min(2, 'Deve conter pelo menos 2 caracteres'),
   assetsTypeId: z.string().min(2, 'Deve conter pelo menos 2 caracteres'),
})

export type Assets = z.infer<typeof Assets>


export const Historic = z.object({
    id: z.string(),
    patrimonyId: z.number(),
    description: z.string().min(2, 'Deve conter pelo menos 2 caracteres'),
})

export type Historic = z.infer<typeof Historic>

export const Sector = z.object({
    id: z.string(),
    description: z.string().min(2, 'Deve conter pelo menos 2 caracteres'),
    status: z.boolean().default(true),
})

export type Sector = z.infer<typeof Sector>

export const Store = z.object({
    id: z.string(),
    description: z.string().min(2, 'Deve conter pelo menos 2 caracteres'),
    cnpj: z.string().min(14, 'Deve conter 14 caracteres'),
    status: z.boolean().default(true),
})

export const Provider = z.object({
    id: z.string(),
    description: z.string().min(2, 'Deve conter pelo menos 2 caracteres'),
    cnpj: z.string().min(14, 'Deve conter 14 caracteres'),
    address : z.string().min(2, 'Deve conter pelo menos 2 caracteres'),
    contact_name: z.string().min(2, 'Deve conter pelo menos 2 caracteres'),
    phone: z.string().min(10, 'Deve conter pelo menos 10 ou 11 caracteres').max(11, 'Deve conter pelo menos 10 ou 11 caracteres'),
    cep: z.string().min(8, 'Deve conter pelo menos 8 caracteres'),
    status: z.boolean().default(true),
})

export type Provider = z.infer<typeof Provider>