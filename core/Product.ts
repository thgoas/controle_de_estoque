import { z } from "zod";
import { Image } from "./Images";


export const Product = z.object({
    id: z.number().optional(),
    cor: z.string().min(2, 'Deve conter pelo menos 2 caracteres'),
    marca: z.string().min(2, 'Deve conter pelo menos 2 caracteres'),
    referencia: z.string().min(2, 'Deve conter pelo menos 2 caracteres'),
    descricao: z.string().min(4, 'Deve conter pelo menos 4 caracteres'),
    complemento: z.string().nullable().optional(),
    grade: z.string().min(1, 'Deve conter pelo menos 1 caracteres'),
    tipo: z.string().min(2, 'Deve conter pelo menos 2 caracteres'),
    modelo: z.string().min(2, 'Deve conter pelo menos 2 caracteres'),
    image:  Image.optional(), 
})

export type Product = z.infer<typeof Product>

