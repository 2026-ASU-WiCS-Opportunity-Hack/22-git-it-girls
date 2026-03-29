'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export interface ImportRow {
  first_name: string
  last_name: string
  date_of_birth?: string
  phone?: string
  email?: string
  gender?: string
  language?: string
  household_size?: string
  address?: string
  notes?: string
}

export interface ImportResult {
  inserted: number
  errors: string[]
}

export async function importClientsAction(rows: ImportRow[]): Promise<ImportResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const errors: string[] = []
  const valid: object[] = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const rowLabel = `Row ${i + 2}` // +2 because row 1 is header

    if (!row.first_name?.trim()) {
      errors.push(`${rowLabel}: first_name is required`)
      continue
    }
    if (!row.last_name?.trim()) {
      errors.push(`${rowLabel}: last_name is required`)
      continue
    }

    const householdRaw = row.household_size?.trim()

    valid.push({
      first_name: row.first_name.trim(),
      last_name: row.last_name.trim(),
      date_of_birth: row.date_of_birth?.trim() || null,
      phone: row.phone?.trim() || null,
      email: row.email?.trim() || null,
      gender: row.gender?.trim() || null,
      language: row.language?.trim() || 'English',
      household_size: householdRaw ? parseInt(householdRaw, 10) : null,
      address: row.address?.trim() || null,
      notes: row.notes?.trim() || null,
      created_by: user.id,
    })
  }

  if (valid.length === 0) {
    return { inserted: 0, errors }
  }

  const { data, error } = await supabase
    .from('clients')
    .insert(valid)
    .select('id')

  if (error) throw new Error(error.message)

  // Audit log (one entry per inserted client)
  const auditRows = (data ?? []).map((c) => ({
    user_id: user.id,
    action: 'create' as const,
    table_name: 'clients',
    record_id: c.id,
  }))
  if (auditRows.length > 0) {
    await supabase.from('audit_log').insert(auditRows)
  }

  revalidatePath('/clients')

  return { inserted: data?.length ?? 0, errors }
}
