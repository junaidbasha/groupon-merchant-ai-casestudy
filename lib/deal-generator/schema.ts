import { z } from "zod"

export const dealDataSchema = z.object({
  dealPrice: z.number().finite(),
  platformFee: z.number().finite(),
  merchantNets: z.number().finite(),
  title: z.string().min(1),
  description: z.string().min(1),
  finePrint: z.string().min(1),
})

export const generateDealRequestSchema = z.object({
  url: z.string().trim().min(1),
  takeHome: z.number().finite().positive(),
})

export type DealData = z.infer<typeof dealDataSchema>
