export type DealEvent =
  | { name: 'deal_creation_started'; props: { service: string; price: number } }
  | { name: 'ai_draft_generated'; props: { titlePreview: string; evalTotal: number } }
  | { name: 'draft_edited'; props: { field: string; editCount: number; pct: number } }
  | { name: 'draft_submitted'; props: { editRate: number; evalScore: number } }
  | { name: 'deal_submitted_for_review'; props: { service: string; evalScore: number; stub: true } }

export function track(event: DealEvent) {
  console.log('[GROUPON_EVENT]', event.name, event.props)
}
