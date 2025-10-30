import { z } from "zod";
import type { Image } from "./Images";

export const Movimento = z.object({
    tipoMovimento: z.string().min(4, 'Deve conter pelo menos 4 caracteres'),
    produtoId: z.number(),
    gradeQuantidade: z.array(
        z.object({ 
            tamanho: z.string(), 
            quantidade: z.number() 
        })
    ).refine((data) => data.reduce((acc, item) => acc + item.quantidade, 0) > 0, {
        message: 'Adiciona pelo menos 1 item',
       
    }),
    descricao: z.string().min(15, 'Deve conter pelo menos 15 caracteres'),
    notaFiscal: z.string(),
})

export type Movimento = z.infer<typeof Movimento>

export interface MovimentoCount {
    id: number
    produto: string
    grade: string[]
    gradeQuantidade: MovimentoCountGrade[]
    total: number
    image: Image
}

export interface MovimentoCountGrade {
    tamanho: string
    quantidade: number
}

export interface MovimentoResponse {
    id: number
    tipoMovimento: string
    produto: string
    tamanho: string
    descricao: string
    notaFiscal: string
    quantidade: number
    createdAt: string
    updatedAt: string
}

