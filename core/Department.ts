import { z } from "zod";

export const Department = z.object({
    id: z.string().optional(),
    name: z.string().min(2, 'Deve conter pelo menos 2 caracteres'),
})

export type Department = z.infer<typeof Department>

export interface DepartmentResponse extends Department {
    createdAt: string
    updatedAt: string
}