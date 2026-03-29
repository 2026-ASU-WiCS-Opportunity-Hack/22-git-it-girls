import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { UserPlus, Upload, Download } from 'lucide-react'
import { Sparkles } from 'lucide-react'
import AiSearchBar from '@/components/clients/AiSearchBar'
import type { Client } from '@/types'

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; service_type?: string; language?: string; ai?: string }>
}) {
  const { q, service_type, language, ai } = await searchParams
  const supabase = await createClient()

  let dbQuery = supabase
    .from('clients')
    .select('id, first_name, last_name, date_of_birth, language, household_size, is_active, phone, email')
    .order('last_name', { ascending: true })

  if (q && q.trim()) {
    dbQuery = dbQuery.or(
      `first_name.ilike.%${q}%,last_name.ilike.%${q}%,phone.ilike.%${q}%,email.ilike.%${q}%`
    )
  }

  if (language && language.trim()) {
    dbQuery = dbQuery.ilike('language', `%${language}%`)
  }

  // For service_type filter: join with service_entries
  let clientIds: string[] | null = null
  if (service_type && service_type.trim()) {
    const { data: entries } = await supabase
      .from('service_entries')
      .select('client_id')
      .ilike('service_type', `%${service_type}%`)
    clientIds = [...new Set((entries ?? []).map((e) => e.client_id))]
    if (clientIds.length > 0) {
      dbQuery = dbQuery.in('id', clientIds)
    } else {
      // no matches — return empty
      clientIds = ['00000000-0000-0000-0000-000000000000']
      dbQuery = dbQuery.in('id', clientIds)
    }
  }

  const { data: clients } = await dbQuery

  const isAiSearch = ai === '1'
  const hasFilters = !!(q || service_type || language)

  return (
    <div className="p-6 space-y-5 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Clients</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {clients?.length ?? 0} client{clients?.length !== 1 ? 's' : ''}
            {hasFilters ? (isAiSearch ? ' from AI search' : ` matching search`) : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/api/clients/export"
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </a>
          <Link
            href="/clients/import"
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Import CSV
          </Link>
          <Link
            href="/clients/new"
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            Add Client
          </Link>
        </div>
      </div>

      {/* Search */}
      <AiSearchBar defaultQuery={q} />

      {/* Active AI filters badge */}
      {isAiSearch && (service_type || language) && (
        <div className="flex flex-wrap gap-2 items-center text-xs">
          <span className="flex items-center gap-1 text-purple-600 font-medium">
            <Sparkles className="h-3 w-3" />
            AI filters active:
          </span>
          {service_type && (
            <span className="rounded-full bg-purple-100 px-2.5 py-1 text-purple-700">
              Service: {service_type}
            </span>
          )}
          {language && (
            <span className="rounded-full bg-purple-100 px-2.5 py-1 text-purple-700">
              Language: {language}
            </span>
          )}
          <Link href="/clients" className="text-slate-400 hover:text-slate-600 underline">
            Clear
          </Link>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left">
              <th className="px-4 py-3 font-medium text-slate-600">Name</th>
              <th className="px-4 py-3 font-medium text-slate-600 hidden sm:table-cell">Date of Birth</th>
              <th className="px-4 py-3 font-medium text-slate-600 hidden md:table-cell">Language</th>
              <th className="px-4 py-3 font-medium text-slate-600 hidden lg:table-cell">Household</th>
              <th className="px-4 py-3 font-medium text-slate-600">Status</th>
              <th className="px-4 py-3 font-medium text-slate-600 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {!clients?.length ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                  {hasFilters
                    ? 'No clients match your search.'
                    : 'No clients yet. '}
                  {!hasFilters && (
                    <Link href="/clients/new" className="text-blue-600 hover:underline">
                      Add the first client.
                    </Link>
                  )}
                </td>
              </tr>
            ) : (
              (clients as Client[]).map((client) => (
                <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/clients/${client.id}`}
                      className="font-medium text-slate-900 hover:text-blue-700"
                    >
                      {client.last_name}, {client.first_name}
                    </Link>
                    {client.phone && (
                      <p className="text-xs text-slate-400 mt-0.5">{client.phone}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600 hidden sm:table-cell">
                    {client.date_of_birth
                      ? new Date(client.date_of_birth + 'T00:00:00').toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-600 hidden md:table-cell">
                    {client.language ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-600 hidden lg:table-cell">
                    {client.household_size ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={client.is_active ? 'default' : 'secondary'}>
                      {client.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/clients/${client.id}`}
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      View →
                    </Link>
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
