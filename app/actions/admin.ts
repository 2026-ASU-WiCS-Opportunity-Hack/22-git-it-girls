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
  return { supabase, userId: user.id }
}

export async function updateUserRoleAction(targetUserId: string, role: 'admin' | 'staff') {
  const { supabase, userId } = await requireAdmin()

  if (targetUserId === userId) throw new Error('You cannot change your own role')

  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', targetUserId)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/users')
}
