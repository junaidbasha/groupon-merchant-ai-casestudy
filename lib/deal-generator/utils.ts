export type TakeHomeValue = number | ""

export const normalizeTakeHomeInput = (rawValue: string): TakeHomeValue => {
  return rawValue === "" ? "" : Number(rawValue)
}

export const parseTakeHomeNumber = (value: TakeHomeValue): number => {
  return typeof value === "number" && Number.isFinite(value) ? value : Number.NaN
}

export const isLikelyBusinessUrl = (value: string): boolean => {
  const normalized = value.trim().toLowerCase()
  return normalized.includes("http") || normalized.includes(".com")
}

export const formatCurrency = (value: number): string => {
  return `$${value.toFixed(2)}`
}
