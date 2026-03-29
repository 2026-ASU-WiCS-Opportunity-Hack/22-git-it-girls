import { createClient } from '@/lib/supabase/server'
import ServiceLogForm from '@/components/services/ServiceLogForm'
import { createServiceAction } from '@/app/actions/services'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function NewServicePage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string }>
}) {
  const { clientId } = await searchParams
  const supabase = await createClient()

  const { data: clients } = await supabase
    .from('clients')
    .select('id, first_name, last_name')
    .eq('is_active', true)
    .order('last_name', { ascending: true })

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">
      <div>
        <Link
          href={clientId ? `/clients/${clientId}` : '/services'}
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-3"
        >
          <ChevronLeft className="h-4 w-4" />
          {clientId ? 'Back to Client' : 'Back to Services'}
        </Link>
        <h1 className="text-2xl font-semibold text-slate-900">Log a Service</h1>
        <p className="text-sm text-slate-500 mt-1">
          Record a visit, session, or any service provided to a client.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <ServiceLogForm
          action={createServiceAction}
          clients={clients ?? []}
          defaultClientId={clientId}
        />
      </div>
    </div>
  )
}
