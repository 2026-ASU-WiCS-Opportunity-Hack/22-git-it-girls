'use server'

import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

function getAnthropicClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not configured. Add it to your .env.local file.')
  }
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

export async function generateClientSummaryAction(clientId: string): Promise<string> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const [{ data: client }, { data: services }] = await Promise.all([
    supabase
      .from('clients')
      .select('first_name, last_name, date_of_birth, gender, language, household_size, notes, custom_fields')
      .eq('id', clientId)
      .single(),
    supabase
      .from('service_entries')
      .select('service_type, service_date, notes, follow_up_date')
      .eq('client_id', clientId)
      .order('service_date', { ascending: false })
      .limit(20),
  ])

  if (!client) throw new Error('Client not found')

  const age = client.date_of_birth
    ? Math.floor((Date.now() - new Date(client.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null

  const clientContext = [
    `Name: ${client.first_name} ${client.last_name}`,
    age ? `Age: ${age}` : null,
    client.gender ? `Gender: ${client.gender}` : null,
    client.language ? `Preferred language: ${client.language}` : null,
    client.household_size ? `Household size: ${client.household_size}` : null,
    client.notes ? `Staff notes: ${client.notes}` : null,
  ].filter(Boolean).join('\n')

  const serviceContext = (services ?? []).length === 0
    ? 'No services logged yet.'
    : (services ?? [])
        .map(
          (s) =>
            `- ${s.service_date}: ${s.service_type}${s.notes ? ` — "${s.notes}"` : ''}${s.follow_up_date ? ` (follow-up: ${s.follow_up_date})` : ''}`
        )
        .join('\n')

  const anthropic = getAnthropicClient()

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 400,
    system: `You are a nonprofit case manager assistant. Write a concise 2–4 sentence case summary for a staff member reviewing this client record.
Focus on: overall needs, services received, patterns, and any pending follow-ups.
Do not repeat obvious information. Be professional and compassionate. Write in plain English.
Do not include the client's name in every sentence.`,
    messages: [
      {
        role: 'user',
        content: `CLIENT:\n${clientContext}\n\nSERVICE HISTORY:\n${serviceContext}`,
      },
    ],
  })

  return message.content[0].type === 'text' ? message.content[0].text.trim() : ''
}

export async function aiSearchClientsAction(query: string): Promise<{
  sql_filters: { name?: string; service_types?: string[]; language?: string }
  explanation: string
}> {
  const anthropic = getAnthropicClient()

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 256,
    system: `You parse natural-language search queries for a nonprofit client database.
Return ONLY a JSON object:
{
  "sql_filters": {
    "name": "partial name to search (optional)",
    "service_types": ["exact service type from list, optional"],
    "language": "preferred language (optional)"
  },
  "explanation": "one short sentence describing what you're searching for"
}

Valid service_types: Therapy Session, Food Assistance, Housing Support, Crisis Counseling, Medical Referral, Employment Services, Child Services, Transportation, Financial Assistance, Legal Aid, Other

Return only JSON, no explanation.`,
    messages: [{ role: 'user', content: query }],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : '{}'
  const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()

  try {
    return JSON.parse(cleaned)
  } catch {
    return { sql_filters: { name: query }, explanation: `Searching for "${query}"` }
  }
}
