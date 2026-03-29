import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'

const ACTION_COLORS: Record<string, string> = {
  create: 'bg-green-50 text-green-700 border-green-200',
  update: 'bg-blue-50 text-blue-700 border-blue-200',
  delete: 'bg-red-50 text-red-700 border-red-200',
}

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; table?: string; page?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/dashboard')

  const { action, table, page: pageStr } = await searchParams
  const page = Math.max(1, parseInt(pageStr ?? '1', 10))
  const PAGE_SIZE = 50
  const offset = (page - 1) * PAGE_SIZE

  let query = supabase
    .from('audit_log')
    .select(`
      id, action, table_name, record_id, created_at,
      profiles (full_name)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)

  if (action) query = query.eq('action', action)
  if (table) query = query.eq('table_name', table)

  const { data: logs, count } = await query
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  const tables = ['clients', 'service_entries', 'appointments', 'field_definitions']

  function buildUrl(params: Record<string, string | undefined>) {
    const p = new URLSearchParams()
    const merged = { action, table, ...params }
    for (const [k, v] of Object.entries(merged)) {
      if (v) p.set(k, v)
    }
    return `/admin/audit?${p.toString()}`
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Audit Log</h1>
        <p className="text-sm text-slate-500 mt-1">
          {count ?? 0} event{count !== 1 ? 's' : ''} recorded
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="text-slate-500 self-center text-xs font-medium">Action:</span>
        {['', 'create', 'update', 'delete'].map((a) => (
          <a
            key={a || 'all'}
            href={buildUrl({ action: a || undefined, page: '1' })}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              (action ?? '') === a
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {a || 'All'}
          </a>
        ))}
        <span className="text-slate-300 mx-1">|</span>
        <span className="text-slate-500 self-center text-xs font-medium">Table:</span>
        {['', ...tables].map((t) => (
          <a
            key={t || 'all'}
            href={buildUrl({ table: t || undefined, page: '1' })}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              (table ?? '') === t
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {t || 'All'}
          </a>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left">
              <th className="px-4 py-3 font-medium text-slate-600">When</th>
              <th className="px-4 py-3 font-medium text-slate-600">User</th>
              <th className="px-4 py-3 font-medium text-slate-600">Action</th>
              <th className="px-4 py-3 font-medium text-slate-600 hidden md:table-cell">Table</th>
              <th className="px-4 py-3 font-medium text-slate-600 hidden lg:table-cell">Record ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {!logs?.length ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                  No audit events match your filters.
                </td>
              </tr>
            ) : (
              (logs as any[]).map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {log.profiles?.full_name ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${ACTION_COLORS[log.action] ?? ''}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 hidden md:table-cell">
                    {log.table_name}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <code className="text-xs text-slate-400">
                      {log.record_id?.slice(0, 8)}…
                    </code>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 && (
            <a
              href={buildUrl({ page: String(page - 1) })}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-50"
            >
              ← Prev
            </a>
          )}
          <span className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <a
              href={buildUrl({ page: String(page + 1) })}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-50"
            >
              Next →
            </a>
          )}
        </div>
      )}
    </div>
  )
}
