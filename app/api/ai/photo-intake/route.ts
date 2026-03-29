import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const
type ImageMediaType = (typeof ALLOWED_TYPES)[number]

const SYSTEM_PROMPT = `You extract intake form data from photos of documents (ID cards, intake forms, referral letters, etc.).
Return ONLY a JSON object with these fields (omit fields you cannot read or infer):
{
  "first_name": string,
  "last_name": string,
  "date_of_birth": "YYYY-MM-DD",
  "phone": string,
  "email": string,
  "gender": "Female" | "Male" | "Non-binary" | "Prefer not to say",
  "language": string,
  "household_size": number,
  "address": string
}
Do not hallucinate. If a field is not visible, omit it. Return only the JSON, no explanation.`

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY is not configured on this server.' },
      { status: 503 }
    )
  }

  const formData = await req.formData()
  const file = formData.get('image') as File | null

  if (!file) return NextResponse.json({ error: 'No image provided' }, { status: 400 })
  if (!ALLOWED_TYPES.includes(file.type as ImageMediaType)) {
    return NextResponse.json(
      { error: `Unsupported file type: ${file.type}. Use JPEG, PNG, GIF, or WebP.` },
      { status: 400 }
    )
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'Image must be under 5 MB' }, { status: 400 })
  }

  const buffer = await file.arrayBuffer()
  const base64 = Buffer.from(buffer).toString('base64')

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: file.type as ImageMediaType,
              data: base64,
            },
          },
          {
            type: 'text',
            text: 'Extract the intake form fields from this document.',
          },
        ],
      },
    ],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : ''

  // Strip markdown code fences if Claude wrapped the JSON
  const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()

  let extracted: Record<string, unknown>
  try {
    extracted = JSON.parse(cleaned)
  } catch {
    return NextResponse.json(
      { error: 'Could not parse fields from this image. Try a clearer photo.' },
      { status: 422 }
    )
  }

  return NextResponse.json({ extracted })
}
