import { z } from "zod";

 
 export const Image = z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    type: z.string().optional(),
    data: z.string().optional(),
    user_id: z.string().optional(),
    product_id: z.number().optional(),
    patrimonies_id: z.string().optional(),
    historical_id: z.string().optional(),
  })

  export type Image = z.infer<typeof Image> 
