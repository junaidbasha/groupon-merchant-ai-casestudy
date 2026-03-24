import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  console.log('DEBUG: GROQ_API_KEY present:', !!process.env.GROQ_API_KEY);
  console.log('GROQ_API_KEY prefix:', process.env.GROQ_API_KEY?.slice(0, 5) ?? 'missing');

  try {
    const body = (await req.json()) as { url?: unknown; takeHome?: unknown };
    const { url, takeHome } = body;

    if (typeof url !== 'string' || !url.trim()) {
      return NextResponse.json({ error: 'Invalid url' }, { status: 400 });
    }

    if (typeof takeHome !== 'number' || !Number.isFinite(takeHome) || takeHome <= 0) {
      return NextResponse.json({ error: 'Invalid takeHome' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'GROQ_API_KEY is not configured' }, { status: 500 });
    }

    const chatCompletion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You are an elite AI pricing engine for a Groupon merchant tool. The user wants to hit a minimum take-home goal of takeHome dollars. Assume the base service is a Keratin Lash Lift (normally $80). Groupon takes a 20% platform fee on the final deal price. Calculate a final deal price that mathematically guarantees the merchant nets exactly or slightly above their take-home goal after the 20% fee. Generate a highly-converting deal title, a 2-sentence description, and standard fine print. Do NOT use generic templates. Analyze the provided URL. If it is a beauty/lashes URL, use premium, high-end vocabulary (for example: fluttery, bespoke, glance). If the URL suggests a different industry, adapt the tone. Every title and description must be unique and highly tailored to the specific business name found in the URL. You must output your response in valid JSON format. Use this exact JSON schema: { "dealPrice": number, "platformFee": number, "merchantNets": number, "title": string, "description": string, "finePrint": string }',
        },
        {
          role: 'user',
          content: `url: ${url}\ntakeHome: ${takeHome}`,
        },
      ],
    });

    let content = chatCompletion.choices[0]?.message?.content || '{}';
    content = content.replace(/```(?:json)?\n?|```/gi, '').trim();
    const data = JSON.parse(content);

    if (
      typeof data?.dealPrice !== 'number' ||
      typeof data?.platformFee !== 'number' ||
      typeof data?.merchantNets !== 'number' ||
      typeof data?.title !== 'string' ||
      typeof data?.description !== 'string' ||
      typeof data?.finePrint !== 'string'
    ) {
      throw new Error('Invalid JSON schema from Groq response');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.log('GROQ ERROR:', error);
    console.error('GROQ_ERROR:', error);
    return NextResponse.json(
      { error: 'Failed to generate deal' },
      { status: 500 },
    );
  }
}
