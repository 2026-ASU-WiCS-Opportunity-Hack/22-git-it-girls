import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { CalendarPlus } from 'lucide-react'
import AppointmentStatusButtons from '@/components/schedule/AppointmentStatusButtons'

const STATUS_COLORS: Record<string, string> = {
  scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-slate-100 text-slate-500 border-slate-200',
}

export default async function SchedulePage() {
  const supabase = await createClient()

  const { data: upcoming } = await supabase
    .from('appointments')
    .select(`
      id, scheduled_at, notes, status,
      clients (id, first_name, last_name),
      profiles (full_name)
    `)
    .eq('status', 'scheduled')
    .gte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: true })
    .limit(50)

  const { data: past } = await supabase
    .from('appointments')
    .select(`
      id, scheduled_at, notes, status,
      clients (id, first_name, last_name),
      profiles (full_name)
    `)
    .or('status.eq.completed,status.eq.cancelled,scheduled_at.lt.' + new Date().toISOString())
    .order('scheduled_at', { ascending: false })
    .limit(20)

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Schedule</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {upcoming?.length ?? 0} upcoming appointment{upcoming?.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/schedule/new"
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <CalendarPlus className="h-4 w-4" />
          New Appointment
        </Link>
      </div>

      {/* Upcoming */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Upcoming</h2>
        {!upcoming?.length ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No upcoming appointments.{' '}
            <Link href="/schedule/new" className="text-blue-600 hover:underline">
              Schedule one.
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {(upcoming as any[]).map((appt) => (
              <AppointmentCard key={appt.id} appt={appt} showActions />
            ))}
          </div>
        )}
      </section>

      {/* Past */}
      {(past?.length ?? 0) > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Recent Past</h2>
          <div className="space-y-2">
            {(past as any[]).map((appt) => (
              <AppointmentCard key={appt.id} appt={appt} showActions={false} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function AppointmentCard({ appt, showActions }: { appt: any; showActions: boolean }) {
  const dt = new Date(appt.scheduled_at)
  const isToday = dt.toDateString() === new Date().toDateString()

  return (
    <div className={`rounded-lg border bg-white p-4 flex flex-col sm:flex-row sm:items-start gap-3 ${STATUS_COLORS[appt.status] ?? ''}`}>
      {/* Date block */}
      <div className="shrink-0 w-16 text-center">
        <p className="text-xs font-medium text-slate-500 uppercase">
          {dt.toLocaleDateString('en-US', { month: 'short' })}
        </p>
        <p className="text-2xl font-bold text-slate-800 leading-none">
          {dt.getDate()}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">
          {dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
        </p>
        {isToday && (
          <span className="mt-1 inline-block rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
            Today
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          {appt.clients ? (
            <Link
              href={`/clients/${appt.clients.id}`}
              className="font-medium text-slate-900 hover:text-blue-700"
            >
              {appt.clients.first_name} {appt.clients.last_name}
            </Link>
          ) : (
            <span className="font-medium text-slate-500">Unknown client</span>
          )}
          <span className={`rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[appt.status]}`}>
            {appt.status}
          </span>
        </div>
        {appt.profiles?.full_name && (
          <p className="text-xs text-slate-500">with {appt.profiles.full_name}</p>
        )}
        {appt.notes && (
          <p className="mt-1 text-sm text-slate-600 truncate">{appt.notes}</p>
        )}
      </div>

      {/* Actions */}
      {showActions && appt.status === 'scheduled' && (
        <div className="shrink-0">
          <AppointmentStatusButtons id={appt.id} />
        </div>
      )}
    </div>
  )
}
