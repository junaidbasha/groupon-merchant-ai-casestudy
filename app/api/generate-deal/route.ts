import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { DEAL_GENERATION_PROMPT, DEAL_EVAL_PROMPT } from '@/lib/deal-generator/prompts'
import { dealDataSchema, generateDealRequestSchema } from '@/lib/deal-generator/schema'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const parseJSON = (content: string) => {
  const cleaned = content.replace(/```(?:json)?\n?|```/gi, '').trim()
  return JSON.parse(cleaned)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validation = generateDealRequestSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 })
    }

    const input = validation.data
    const currentFeeRate = input.goal === 'Test Groupon for the first time' ? 0.20 : 0.30

    // ── CALL 1: Generate deal ──────────────────────────────────
    const genResponse = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      temperature: 0.4,
      messages: [
        { role: 'system', content: 'You are a Groupon deal creation specialist. Return valid JSON only.' },
        { role: 'user', content: DEAL_GENERATION_PROMPT({ ...input, feeRate: currentFeeRate }) },
      ],
    })

    const rawDeal = parseJSON(genResponse.choices[0]?.message?.content || '{}')

    // ── CALL 2: LLM-as-judge eval ──────────────────────────────
    // NOTE: Known limitation — model evaluates its own output.
    // Self-favorability bias applies. Scores are directional only.
    // In production: validate rubric against redemption rate data within 60 days.
    const evalResponse = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      temperature: 0.2,
      messages: [
        { role: 'system', content: 'You are a Groupon deal quality evaluator. Be calibrated and honest. Return valid JSON only.' },
        { role: 'user', content: DEAL_EVAL_PROMPT(rawDeal, input.service, input.price) },
      ],
    })

    const rawEval = parseJSON(evalResponse.choices[0]?.message?.content || '{}')

    // ── Compute margin (single source of truth) ────────────────
    const lowestDealPrice = Math.min(...rawDeal.options.map((o: any) => o.dealPrice))
    const grossMargin = lowestDealPrice - input.cost
    const netMargin = (lowestDealPrice * (1 - currentFeeRate)) - input.cost

    // Recompute eval total from dimension scores (don't trust AI's stated total)
    const evalTotal = (rawEval.specificity?.score ?? 0) +
                      (rawEval.conversionLanguage?.score ?? 0) +
                      (rawEval.categoryFit?.score ?? 0)

    const payload = {
      ...rawDeal,
      lowestDealPrice,
      grossMargin,
      netMargin,
      platformFeeRate: currentFeeRate,
      evalScores: {
        specificity: rawEval.specificity,
        conversionLanguage: rawEval.conversionLanguage,
        categoryFit: rawEval.categoryFit,
        total: evalTotal,
        overallReasoning: rawEval.overallReasoning,
      },
    }

    const parsed = dealDataSchema.safeParse(payload)
    if (!parsed.success) {
      console.error('Schema validation failed:', parsed.error)
      return NextResponse.json({ error: 'Invalid AI response structure' }, { status: 500 })
    }

    return NextResponse.json(parsed.data)

  } catch (error) {
    console.error('DEAL_GEN_ERROR:', error)
    return NextResponse.json({ error: 'Failed to generate deal' }, { status: 500 })
  }
}
