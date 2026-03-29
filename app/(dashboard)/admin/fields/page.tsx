import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import FieldDefinitionsManager from '@/components/clients/FieldDefinitionsManager'
import type { FieldDefinition } from '@/types'

export default async function AdminFieldsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: fields } = await supabase
    .from('field_definitions')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Custom Fields</h1>
        <p className="text-sm text-slate-500 mt-1">
          Define extra fields that appear on every client record. Values are stored in the{' '}
          <code className="bg-slate-100 px-1 rounded text-xs">custom_fields</code> JSON column.
        </p>
      </div>
      <FieldDefinitionsManager fields={(fields ?? []) as FieldDefinition[]} />
    </div>
  )
}
