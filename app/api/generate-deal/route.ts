import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { DEAL_SYSTEM_PROMPT } from '@/lib/deal-generator/prompts';
import { dealDataSchema, generateDealRequestSchema } from '@/lib/deal-generator/schema';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const parseModelResponse = (content: string) => {
  const cleanedContent = content.replace(/```(?:json)?\n?|```/gi, '').trim();
  const rawData = JSON.parse(cleanedContent);
  const parsedData = dealDataSchema.safeParse(rawData);

  if (!parsedData.success) {
    throw new Error('Invalid JSON schema from Groq response');
  }

  return parsedData.data;
};

export async function POST(req: Request) {
  console.log('DEBUG: GROQ_API_KEY present:', !!process.env.GROQ_API_KEY);
  console.log('GROQ_API_KEY prefix:', process.env.GROQ_API_KEY?.slice(0, 5) ?? 'missing');

  try {
    const body = await req.json();
    const requestValidation = generateDealRequestSchema.safeParse(body);

    if (!requestValidation.success) {
      return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
    }

    const { url, takeHome } = requestValidation.data;

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'GROQ_API_KEY is not configured' }, { status: 500 });
    }

    const chatCompletion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: DEAL_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `url: ${url}\ntakeHome: ${takeHome}`,
        },
      ],
    });

    let content = chatCompletion.choices[0]?.message?.content || '{}';
    const data = parseModelResponse(content);

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
