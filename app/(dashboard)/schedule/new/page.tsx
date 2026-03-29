import { createClient } from '@/lib/supabase/server'
import { createAppointmentAction } from '@/app/actions/appointments'
import NewAppointmentForm from '@/components/schedule/NewAppointmentForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function NewAppointmentPage() {
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
          href="/schedule"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-3"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Schedule
        </Link>
        <h1 className="text-2xl font-semibold text-slate-900">New Appointment</h1>
        <p className="text-sm text-slate-500 mt-1">Schedule an upcoming appointment for a client.</p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <NewAppointmentForm action={createAppointmentAction} clients={clients ?? []} />
      </div>
    </div>
  )
}
