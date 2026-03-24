export const TOTAL_EDITABLE_FIELDS = 6

export function computeEditRate(editedCount: number): number {
  return Math.round((editedCount / TOTAL_EDITABLE_FIELDS) * 100)
}

export function getEditRateStatus(pct: number): 'low' | 'target' | 'high' {
  if (pct < 15) return 'low'
  if (pct > 50) return 'high'
  return 'target'
}
