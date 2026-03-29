'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createAppointmentAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error, data } = await supabase
    .from('appointments')
    .insert({
      client_id: formData.get('client_id') as string,
      staff_id: user.id,
      scheduled_at: formData.get('scheduled_at') as string,
      notes: (formData.get('notes') as string || '').trim() || null,
      status: 'scheduled',
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  await supabase.from('audit_log').insert({
    user_id: user.id,
    action: 'create',
    table_name: 'appointments',
    record_id: data.id,
  })

  revalidatePath('/schedule')
  redirect('/schedule')
}

export async function updateAppointmentStatusAction(id: string, status: 'completed' | 'cancelled') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id)

  if (error) throw new Error(error.message)

  await supabase.from('audit_log').insert({
    user_id: user.id,
    action: 'update',
    table_name: 'appointments',
    record_id: id,
  })

  revalidatePath('/schedule')
}
