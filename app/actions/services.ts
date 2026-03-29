'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createServiceAction(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const clientId = formData.get('client_id') as string
  const followUpRaw = formData.get('follow_up_date') as string

  const payload = {
    client_id: clientId,
    service_type: formData.get('service_type') as string,
    service_date: formData.get('service_date') as string,
    staff_id: user.id,
    notes: (formData.get('notes') as string || '').trim() || null,
    follow_up_date: followUpRaw || null,
  }

  const { data, error } = await supabase
    .from('service_entries')
    .insert(payload)
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  await supabase.from('audit_log').insert({
    user_id: user.id,
    action: 'create',
    table_name: 'service_entries',
    record_id: data.id,
  })

  revalidatePath(`/clients/${clientId}`)
  revalidatePath('/services')
  redirect(`/clients/${clientId}`)
}
