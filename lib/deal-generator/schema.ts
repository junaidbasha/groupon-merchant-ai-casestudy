import { z } from "zod"

export const serviceOptionSchema = z.object({
  name: z.string().min(1),
  originalPrice: z.number().finite().positive(),
  dealPrice: z.number().finite().positive(),
})

export const evalScoresSchema = z.object({
  specificity: z.object({ score: z.number().min(0).max(10), reason: z.string() }),
  conversionLanguage: z.object({ score: z.number().min(0).max(10), reason: z.string() }),
  categoryFit: z.object({ score: z.number().min(0).max(10), reason: z.string() }),
  total: z.number().min(0).max(30),
  overallReasoning: z.string(),
})

export const dealDataSchema = z.object({
  title: z.string().min(1),
  tagline: z.string().min(1),
  options: z.array(serviceOptionSchema).min(1),
  description: z.string().min(1),
  finePrint: z.string().min(1),
  category: z.string().min(1),
  lowestDealPrice: z.number().finite().positive(),
  grossMargin: z.number().finite(),
  netMargin: z.number().finite(),
  platformFeeRate: z.union([z.literal(0.20), z.literal(0.30)]),
  evalScores: evalScoresSchema,
})

export const generateDealRequestSchema = z.object({
  service: z.string().trim().min(1),
  price: z.number().finite().positive(),
  cost: z.number().finite().min(0),
  slowDays: z.string().trim().min(1),
  studioDesc: z.string().trim().min(1),
  goal: z.string().trim().min(1),
})

export type DealData = z.infer<typeof dealDataSchema>
export type GenerateDealRequest = z.infer<typeof generateDealRequestSchema>
