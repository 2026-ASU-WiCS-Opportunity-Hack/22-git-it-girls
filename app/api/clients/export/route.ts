import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const CSV_HEADERS = [
  'id',
  'first_name',
  'last_name',
  'date_of_birth',
  'phone',
  'email',
  'gender',
  'language',
  'household_size',
  'address',
  'notes',
  'is_active',
  'created_at',
]

function escapeCSV(value: unknown): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export async function GET() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: clients, error } = await supabase
    .from('clients')
    .select('id, first_name, last_name, date_of_birth, phone, email, gender, language, household_size, address, notes, is_active, created_at')
    .order('last_name', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const rows = [
    CSV_HEADERS.join(','),
    ...(clients ?? []).map((c) =>
      CSV_HEADERS.map((h) => escapeCSV((c as Record<string, unknown>)[h])).join(',')
    ),
  ]

  return new NextResponse(rows.join('\n'), {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="clients-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}
