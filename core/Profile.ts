import { z } from "zod"

export const Profile = z.object({
    name: z.string().min(4, 'Deve ter pelo menos 4 caracteres'),
    password: z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/, 'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial'),
    confirmePassword: z.string()
}).refine((data) => data.password === data.confirmePassword, {
    message: 'As senhas não coincidem',
    path: ['confirmePassword'],
})

export const ProfileName = z.object({
    name: z.string().min(4, 'Deve ter pelo menos 4 caracteres'),
})

export const ProfilePassword = z.object({
    password: z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/, 'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial'),
    confirmePassword: z.string()
}).refine((data) => data.password === data.confirmePassword, {
    message: 'As senhas não coincidem',
    path: ['confirmePassword'],
})

export type Profile = z.output<typeof Profile>

export type ProfileName = z.output<typeof ProfileName>

export type ProfilePassword = z.output<typeof ProfilePassword>