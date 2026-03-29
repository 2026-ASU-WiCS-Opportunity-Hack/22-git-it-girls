import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ClientForm from '@/components/clients/ClientForm'
import { updateClientAction } from '@/app/actions/clients'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import type { FieldDefinition } from '@/types'

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: client }, { data: customFields }] = await Promise.all([
    supabase.from('clients').select('*').eq('id', id).single(),
    supabase
      .from('field_definitions')
      .select('*')
      .order('sort_order', { ascending: true }),
  ])

  if (!client) notFound()

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5">
      <div>
        <Link
          href={`/clients/${id}`}
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-3"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Profile
        </Link>
        <h1 className="text-2xl font-semibold text-slate-900">
          Edit — {client.first_name} {client.last_name}
        </h1>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <ClientForm
          action={updateClientAction}
          defaultValues={client}
          submitLabel="Save Changes"
          customFields={(customFields ?? []) as FieldDefinition[]}
        />
      </div>
    </div>
  )
}
