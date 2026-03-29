import ClientForm from '@/components/clients/ClientForm'
import PhotoIntakeWidget from '@/components/clients/PhotoIntakeWidget'
import { createClientAction } from '@/app/actions/clients'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import type { Client, FieldDefinition } from '@/types'

const INTAKE_FIELDS = [
  'first_name', 'last_name', 'date_of_birth', 'phone',
  'email', 'gender', 'language', 'household_size', 'address',
] as const

export default async function NewClientPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const sp = await searchParams
  const supabase = await createClient()
  const { data: customFields } = await supabase
    .from('field_definitions')
    .select('*')
    .order('sort_order', { ascending: true })

  // Build prefilled defaultValues from searchParams (populated by PhotoIntakeWidget)
  const prefilled: Partial<Client> = {}
  for (const field of INTAKE_FIELDS) {
    if (sp[field]) {
      (prefilled as Record<string, unknown>)[field] =
        field === 'household_size' ? parseInt(sp[field], 10) : sp[field]
    }
  }
  const hasPrefilled = Object.keys(prefilled).length > 0

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5">
      <div>
        <Link
          href="/clients"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-3"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Clients
        </Link>
        <h1 className="text-2xl font-semibold text-slate-900">Register New Client</h1>
        <p className="text-sm text-slate-500 mt-1">
          Fields marked * are required. All other information can be added later.
        </p>
      </div>

      {hasPrefilled && (
        <div className="rounded-md bg-green-50 border border-green-200 px-4 py-2.5 text-sm text-green-800">
          Fields pre-filled from document scan — please review and correct as needed.
        </div>
      )}

      <PhotoIntakeWidget />

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <ClientForm
          action={createClientAction}
          submitLabel="Register Client"
          defaultValues={prefilled}
          customFields={(customFields ?? []) as FieldDefinition[]}
        />
      </div>
    </div>
  )
}
