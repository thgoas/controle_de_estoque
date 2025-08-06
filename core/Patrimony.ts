import { z } from "zod";

export const PatrimonyConnection = z.object({
    status: z.string().optional(),
    patrimonyIdOne: z.string().min(1, 'Deve conter pelo menos 1 caracteres'),
    patrimonyIdTwo: z.string().min(1, 'Deve conter pelo menos 1 caracteres'),
})

export type PatrimonyConnection = z.infer<typeof PatrimonyConnection>

export const Patrimony = z.object({
    id: z.string().min(1, 'Deve conter pelo menos 1 caracteres'),
    description: z.string().min(10, 'Deve conter pelo menos 10 caracteres'),
    serial_number: z.string(),
    assets_id: z.string().min(1, 'Deve conter pelo menos 1 caracteres'),
    assets_subgroup_id: z.string().min(1, 'Deve conter pelo menos 1 caracteres'),
    store_id: z.string().min(1, 'Deve conter pelo menos 1 caracteres'),
    sector_id: z.string().min(1, 'Deve conter pelo menos 1 caracteres'),
    invoice: z.string().optional(),
    purchase_date: z.string().optional(),
    price: z.number(),
    guarantee_date: z.string().optional(),
    low_date: z.string().optional(),
    note: z.string().optional(),
    people: z.string().optional(),
    provider_id: z.string().optional(),
    patrimoniesConnections: z.array(PatrimonyConnection).optional(),
    status_id: z.string().min(1, 'Deve conter pelo menos 1 caracteres'),

})

export type Patrimony = z.infer<typeof Patrimony>


export const Status = z.object({
    id: z.string().optional(),
    description: z.string().min(2, 'Deve conter pelo menos 2 caracteres'),
    status: z.boolean().default(true),
    color: z.string().optional(),
})

export type Status = z.infer<typeof Status>

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

export const AssetsSubgroupAssets = z.object({
    assetsSubgroupId: z.string().min(1, 'Deve conter pelo menos 1 caracteres'),
    assetsId: z.string().min(1, 'Deve conter pelo menos 1 caracteres'),
})

export type AssetsSubgroupAssets = z.infer<typeof AssetsSubgroupAssets>

export const Assets = z.object({
   id: z.string().optional(),
   description: z.string().min(4, 'Deve conter pelo menos 4 caracteres'),
   assetsClassificationId: z.string().min(2, 'Deve conter pelo menos 2 caracteres'),
   assetsTypeId: z.string().min(2, 'Deve conter pelo menos 2 caracteres'),
   assetsSubgroupAssets: z.array(AssetsSubgroupAssets).optional(),
})

export type Assets = z.infer<typeof Assets>


export const Historic = z.object({
    id: z.string(),
    patrimony_id: z.string(),
    description: z.string().min(2, 'Deve conter pelo menos 2 caracteres'),
    type_historic: z.string().min(2, 'Deve conter pelo menos 2 caracteres'),
    it_went_out_store_id: z.string().optional(),
    entered_store_id: z.string().optional(),
    it_went_out_sector_id: z.string().optional(),
    entered_sector_id: z.string().optional(),
    it_went_out_date: z.string().optional(),
    entered_date: z.string().optional(),
    user_identification_id: z.string().min(2, 'Deve conter pelo menos 2 caracteres'),
    createdAt: z.string().optional(),
    before_update: z.string().optional(),
    after_update: z.string().optional(),
})

export type Historic = z.infer<typeof Historic>

export const HistoricJoin = z.object({
    id: z.string(),
    patrimony_id: z.string(),
    description: z.string().min(2, 'Deve conter pelo menos 2 caracteres'),
    type_historic: z.string().min(2, 'Deve conter pelo menos 2 caracteres'),
    it_went_out_store: z.string().optional(),
    entered_store: z.string().optional(),
    it_went_out_sector: z.string().optional(),
    entered_sector: z.string().optional(),
    it_went_out_date: z.string().optional(),
    entered_date: z.string().optional(),
    user_identification: z.string().min(2, 'Deve conter pelo menos 2 caracteres'),
    createdAt: z.string().optional(),
    before_update: z.string().optional(),
    after_update: z.string().optional(),
})

export type HistoricJoin = z.infer<typeof HistoricJoin>

export const Sector = z.object({
    id: z.string().optional(),
    description: z.string().min(2, 'Deve conter pelo menos 2 caracteres'),
    status: z.boolean().default(true),
})

export type Sector = z.infer<typeof Sector>

export const Store = z.object({
    id: z.string().optional(),
    description: z.string().min(2, 'Deve conter pelo menos 2 caracteres'),
    cnpj: z.string().length(18, 'Deve conter 14 caracteres'),
    status: z.union([
        z.literal('true').transform(() => true),
        z.literal('false').transform(() => false),
        z.boolean(),
    ]).default(true),
})

export type Store = z.infer<typeof Store>

export const Provider = z.object({
    id: z.string().optional(),
    description: z.string().min(2, 'Deve conter pelo menos 2 caracteres'),
    cnpj: z.string().length(18, 'Deve conter 14 caracteres'),
    address : z.string().min(2, 'Deve conter pelo menos 2 caracteres'),
    contact_name: z.string().min(2, 'Deve conter pelo menos 2 caracteres').optional(),
    phone: z.string().min(14, 'Deve conter pelo menos 14 ou 16 caracteres').max(16, 'Deve conter pelo menos 10 ou 11 caracteres').optional(),
    cep: z.string().min(8, 'Deve conter pelo menos 8 caracteres'),
    status: z.boolean().default(true),
    email: z.string().email('Deve conter um email válido').optional(),
    obs: z.string().optional(),
})

export type Provider = z.infer<typeof Provider>

export const MovementData = z.object({
    it_went_out_date: z.string().min(1, 'Preencha o campo'),
    entered_date: z.string().min(1, 'Preencha o campo'),
    description: z.string().min(15, 'Deve conter pelo menos 15 caracteres'),
    patrimony_id: z.string().min(1, 'Deve conter pelo menos 1 caracteres'),
    entered_store_id: z.string().min(1, 'Deve conter pelo menos 1 caracteres'),
    entered_sector_id: z.string().min(1, 'Deve conter pelo menos 1 caracteres'),
    status_id: z.string().min(1, 'Deve conter pelo menos 1 caracteres'),
})
export type MovementData = z.infer<typeof MovementData>

export const StatusData = z.object({
    date: z.string().min(1, 'Preencha o campo'),
    status_id: z.string().min(1, 'Preencha o campo'),   
    description: z.string().min(15, 'Deve conter pelo menos 15 caracteres'),
    patrimony_id: z.string().min(1, 'Deve conter pelo menos 1 caracteres'),   
})
export type StatusData = z.infer<typeof StatusData>
