import { z } from "zod"

  export enum UserRole {
    ADMIN = 'admin',
    USER = 'user'
  }

  export interface IUserLogged {
    id: string
    name: string
    email:string
    role: string
    department: string
    status: boolean
    token: string
  }

  
  export const User = z.object({
    id: z.string().optional(),
    name: z.string().min(4, 'Deve ter pelo menos 4 caracteres'),
    email: z.string().email('Email Inválido'),
    role: z.nativeEnum(UserRole),
    department: z.string(),
    status: z.boolean().default(true),
    password: z.string().optional(),
  })

  export type User = z.infer<typeof User>
  

  

  
  export interface UserResponse extends User {
      createdAt: string
      updatedAt: string
  }
