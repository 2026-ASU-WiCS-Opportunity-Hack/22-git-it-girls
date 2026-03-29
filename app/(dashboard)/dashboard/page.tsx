import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, ClipboardList, CalendarDays, AlertCircle } from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  const supabase = await createClient()

  const [
    { count: totalClients },
    { count: servicesThisWeek },
    { count: upcomingAppointments },
    { count: pendingFollowUps },
  ] = await Promise.all([
    supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true),
    supabase
      .from('service_entries')
      .select('*', { count: 'exact', head: true })
      .gte('service_date', getStartOfWeek()),
    supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'scheduled')
      .gte('scheduled_at', new Date().toISOString()),
    supabase
      .from('follow_ups')
      .select('*', { count: 'exact', head: true })
      .eq('is_completed', false),
  ])

  return {
    totalClients: totalClients ?? 0,
    servicesThisWeek: servicesThisWeek ?? 0,
    upcomingAppointments: upcomingAppointments ?? 0,
    pendingFollowUps: pendingFollowUps ?? 0,
  }
}

async function getRecentServices() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('service_entries')
    .select(`
      id,
      service_type,
      service_date,
      notes,
      clients (first_name, last_name)
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  return data ?? []
}

function getStartOfWeek() {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d.toISOString().split('T')[0]
}

export default async function DashboardPage() {
  const [stats, recentServices] = await Promise.all([
    getStats(),
    getRecentServices(),
  ])

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Overview of your clients and services</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Clients"
          value={stats.totalClients}
          icon={<Users className="h-4 w-4 text-blue-600" />}
          href="/clients"
          color="blue"
        />
        <StatCard
          title="Services This Week"
          value={stats.servicesThisWeek}
          icon={<ClipboardList className="h-4 w-4 text-green-600" />}
          href="/services"
          color="green"
        />
        <StatCard
          title="Upcoming Appointments"
          value={stats.upcomingAppointments}
          icon={<CalendarDays className="h-4 w-4 text-purple-600" />}
          href="/schedule"
          color="purple"
        />
        <StatCard
          title="Pending Follow-ups"
          value={stats.pendingFollowUps}
          icon={<AlertCircle className="h-4 w-4 text-amber-600" />}
          href="/services"
          color="amber"
        />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/clients/new"
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          + Add Client
        </Link>
        <Link
          href="/services/new"
          className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          + Log Service
        </Link>
      </div>

      {/* Recent Services */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Recent Services</CardTitle>
            <Link href="/services" className="text-xs text-blue-600 hover:underline">
              View all
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentServices.length === 0 ? (
            <p className="text-sm text-slate-500 py-4 text-center">
              No services logged yet.{' '}
              <Link href="/services/new" className="text-blue-600 hover:underline">
                Log the first one.
              </Link>
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentServices.map((entry: any) => (
                <li key={entry.id} className="flex items-start justify-between py-3 gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {entry.clients?.first_name} {entry.clients?.last_name}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {entry.notes ?? 'No notes'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge variant="secondary" className="text-xs">
                      {entry.service_type}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      {new Date(entry.service_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  href,
  color,
}: {
  title: string
  value: number
  icon: React.ReactNode
  href: string
  color: 'blue' | 'green' | 'purple' | 'amber'
}) {
  const bg = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50',
    amber: 'bg-amber-50',
  }[color]

  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="pt-5 pb-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <div className={`rounded-md p-2 ${bg}`}>{icon}</div>
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
