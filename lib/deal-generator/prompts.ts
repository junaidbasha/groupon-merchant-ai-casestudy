export const DEAL_GENERATION_PROMPT = (params: {
  service: string
  price: number
  cost: number
  slowDays: string
  studioDesc: string
  goal: string
  feeRate: number
}) => `You are a Groupon deal creation specialist for local beauty and wellness businesses.

Create a publish-ready Groupon deal for this merchant:
- Service: ${params.service}
- Regular price: $${params.price}
- Their cost per service (supplies + time): $${params.cost}
- Slow days to fill: ${params.slowDays}
- Studio: ${params.studioDesc}
- Goal: ${params.goal}

Pricing rules:
- Discount Strategy: If the goal is "Acquire long-term regulars", enforce a deeper discount (50-65% off) to drive volume. If the goal is anything else, use a standard margin-safe discount (35-50% off).
- Create TWO service tiers (base + premium at ~25% higher)
- Deal prices must ensure merchant nets above cost after Groupon's ~${params.feeRate * 100}% platform fee

Category must be chosen from ONLY this list:
"Beauty & Spas", "Eyelash Extensions", "Eyelash Lifts & Tints", "Lash & Brow",
"Waxing", "Brazilian Waxing", "Body Waxing", "Facial Waxing",
"Eyebrow Threading & Shaping", "Facials", "Skin Care",
"Nail Salons", "Massage", "Hair Removal", "Tanning", "Hair Salons", "Makeup"

Return ONLY valid JSON in this exact schema:
{
  "title": "string (max 60 chars, specific to this merchant)",
  "tagline": "string (1 line urgency or value prop)",
  "options": [
    {"name": "string (specific service name)", "originalPrice": number, "dealPrice": number},
    {"name": "string (premium tier)", "originalPrice": number, "dealPrice": number}
  ],
  "description": "string (2-3 sentences, name the city/neighbourhood, specific to this merchant)",
  "finePrint": "string (expiry 90 days; new customers only; 24h booking notice; 1 per person; no cash value)",
  "category": "string (exact match from the list above)"
}`

export const DEAL_EVAL_PROMPT = (deal: {
  title: string
  description: string
  category: string
  options: Array<{name: string, originalPrice: number, dealPrice: number}>
}, service: string, price: number) => `You are a Groupon deal quality evaluator. Score this deal for a ${service} at $${price} regular price.

DEAL:
Title: ${deal.title}
Description: ${deal.description}  
Category: ${deal.category}
Options: ${deal.options.map(o => `${o.name} ($${o.originalPrice}→$${o.dealPrice})`).join(' | ')}

Score each dimension 0-10. Be calibrated — 7+ must be earned:
1. specificity: Does copy name real service + location? Feels specific to THIS merchant vs. generic spa copy?
2. conversionLanguage: Does title/tagline create real buyer desire or urgency?  
3. categoryFit: Is category accurate AND optimal for Groupon search? (10=perfect, 0=wrong category)

Return ONLY valid JSON:
{
  "specificity": {"score": number, "reason": "one sentence"},
  "conversionLanguage": {"score": number, "reason": "one sentence"},
  "categoryFit": {"score": number, "reason": "one sentence"},
  "total": number,
  "overallReasoning": "one sentence summary of deal quality"
}`
