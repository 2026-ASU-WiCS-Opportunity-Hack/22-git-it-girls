'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') throw new Error('Admin access required')
  return supabase
}

function toFieldKey(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 40)
}

export async function createFieldAction(formData: FormData) {
  const supabase = await requireAdmin()

  const label = (formData.get('label') as string).trim()
  if (!label) throw new Error('Label is required')

  const field_key = toFieldKey(label)
  const field_type = (formData.get('field_type') as string) || 'text'
  const is_required = formData.get('is_required') === 'true'

  // Get max sort_order
  const { data: existing } = await supabase
    .from('field_definitions')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()

  const sort_order = (existing?.sort_order ?? -1) + 1

  const { error } = await supabase.from('field_definitions').insert({
    label,
    field_key,
    field_type,
    is_required,
    sort_order,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/admin/fields')
}

export async function deleteFieldAction(id: string) {
  const supabase = await requireAdmin()

  const { error } = await supabase
    .from('field_definitions')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/fields')
}

export async function updateFieldOrderAction(ids: string[]) {
  const supabase = await requireAdmin()

  await Promise.all(
    ids.map((id, index) =>
      supabase
        .from('field_definitions')
        .update({ sort_order: index })
        .eq('id', id)
    )
  )

  revalidatePath('/admin/fields')
}
