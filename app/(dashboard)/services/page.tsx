import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ClipboardList } from 'lucide-react'

export default async function ServicesPage() {
  const supabase = await createClient()

  const { data: services } = await supabase
    .from('service_entries')
    .select(`
      id,
      service_type,
      service_date,
      notes,
      follow_up_date,
      clients (id, first_name, last_name),
      profiles (full_name)
    `)
    .order('service_date', { ascending: false })
    .limit(100)

  return (
    <div className="p-6 space-y-5 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Services</h1>
          <p className="text-sm text-slate-500 mt-0.5">All logged visits and services</p>
        </div>
        <Link
          href="/services/new"
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <ClipboardList className="h-4 w-4" />
          Log Service
        </Link>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left">
              <th className="px-4 py-3 font-medium text-slate-600">Client</th>
              <th className="px-4 py-3 font-medium text-slate-600">Service</th>
              <th className="px-4 py-3 font-medium text-slate-600 hidden sm:table-cell">Date</th>
              <th className="px-4 py-3 font-medium text-slate-600 hidden lg:table-cell">Notes</th>
              <th className="px-4 py-3 font-medium text-slate-600 hidden md:table-cell">Follow-up</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {!services?.length ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                  No services logged yet.{' '}
                  <Link href="/services/new" className="text-blue-600 hover:underline">
                    Log the first one.
                  </Link>
                </td>
              </tr>
            ) : (
              services.map((entry: any) => (
                <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    {entry.clients ? (
                      <Link
                        href={`/clients/${entry.clients.id}`}
                        className="font-medium text-slate-900 hover:text-blue-700"
                      >
                        {entry.clients.last_name}, {entry.clients.first_name}
                      </Link>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{entry.service_type}</Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-600 hidden sm:table-cell">
                    {new Date(entry.service_date + 'T00:00:00').toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3 text-slate-500 hidden lg:table-cell max-w-xs">
                    <p className="truncate">{entry.notes ?? '—'}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {entry.follow_up_date ? (
                      <span className="text-amber-600 text-xs font-medium">
                        {new Date(entry.follow_up_date + 'T00:00:00').toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
