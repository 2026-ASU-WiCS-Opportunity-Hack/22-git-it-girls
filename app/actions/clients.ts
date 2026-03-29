'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createClientAction(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const householdRaw = formData.get('household_size') as string
  const dobRaw = formData.get('date_of_birth') as string

  // Collect custom_field__ prefixed entries
  const custom_fields: Record<string, unknown> = {}
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('custom_field__') && (value as string).trim() !== '') {
      const fieldKey = key.replace('custom_field__', '')
      const raw = (value as string).trim()
      custom_fields[fieldKey] = raw === 'true' ? true : raw === 'false' ? false : raw
    }
  }

  const payload = {
    first_name: (formData.get('first_name') as string).trim(),
    last_name: (formData.get('last_name') as string).trim(),
    date_of_birth: dobRaw || null,
    phone: (formData.get('phone') as string || '').trim() || null,
    email: (formData.get('email') as string || '').trim() || null,
    gender: (formData.get('gender') as string) || null,
    language: (formData.get('language') as string) || 'English',
    household_size: householdRaw ? parseInt(householdRaw, 10) : null,
    address: (formData.get('address') as string || '').trim() || null,
    notes: (formData.get('notes') as string || '').trim() || null,
    custom_fields,
    created_by: user.id,
  }

  const { data, error } = await supabase
    .from('clients')
    .insert(payload)
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  // Audit log
  await supabase.from('audit_log').insert({
    user_id: user.id,
    action: 'create',
    table_name: 'clients',
    record_id: data.id,
  })

  revalidatePath('/clients')
  redirect(`/clients/${data.id}`)
}

export async function updateClientAction(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const id = formData.get('id') as string
  const householdRaw = formData.get('household_size') as string
  const dobRaw = formData.get('date_of_birth') as string

  // Collect custom_field__ prefixed entries
  const custom_fields: Record<string, unknown> = {}
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('custom_field__') && (value as string).trim() !== '') {
      const fieldKey = key.replace('custom_field__', '')
      const raw = (value as string).trim()
      custom_fields[fieldKey] = raw === 'true' ? true : raw === 'false' ? false : raw
    }
  }

  const payload = {
    first_name: (formData.get('first_name') as string).trim(),
    last_name: (formData.get('last_name') as string).trim(),
    date_of_birth: dobRaw || null,
    phone: (formData.get('phone') as string || '').trim() || null,
    email: (formData.get('email') as string || '').trim() || null,
    gender: (formData.get('gender') as string) || null,
    language: (formData.get('language') as string) || 'English',
    household_size: householdRaw ? parseInt(householdRaw, 10) : null,
    address: (formData.get('address') as string || '').trim() || null,
    notes: (formData.get('notes') as string || '').trim() || null,
    custom_fields,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('clients')
    .update(payload)
    .eq('id', id)

  if (error) throw new Error(error.message)

  await supabase.from('audit_log').insert({
    user_id: user.id,
    action: 'update',
    table_name: 'clients',
    record_id: id,
  })

  revalidatePath(`/clients/${id}`)
  redirect(`/clients/${id}`)
}
