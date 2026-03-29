import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SERVICE_TYPES } from '@/types'
import {
  ServicesByTypeChart,
  MonthlyTrendChart,
  LanguageChart,
} from '@/components/reports/ReportsCharts'

async function getReportData() {
  const supabase = await createClient()

  const [
    { data: services },
    { data: clients },
    { count: totalClients },
    { count: totalServices },
  ] = await Promise.all([
    supabase
      .from('service_entries')
      .select('service_type, service_date'),
    supabase
      .from('clients')
      .select('language, created_at')
      .eq('is_active', true),
    supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true),
    supabase
      .from('service_entries')
      .select('*', { count: 'exact', head: true }),
  ])

  // Services by type
  const typeCounts: Record<string, number> = {}
  for (const t of SERVICE_TYPES) typeCounts[t] = 0
  for (const s of services ?? []) {
    if (typeCounts[s.service_type] !== undefined) typeCounts[s.service_type]++
    else typeCounts[s.service_type] = (typeCounts[s.service_type] ?? 0) + 1
  }
  const servicesByType = Object.entries(typeCounts)
    .map(([type, count]) => ({ type, count }))
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count)

  // Monthly trend — last 8 months
  const monthlyMap: Record<string, number> = {}
  const now = new Date()
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    monthlyMap[key] = 0
  }
  for (const s of services ?? []) {
    const d = new Date(s.service_date + 'T00:00:00')
    const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    if (key in monthlyMap) monthlyMap[key]++
  }
  const monthlyTrend = Object.entries(monthlyMap).map(([month, count]) => ({ month, count }))

  // Language distribution
  const langMap: Record<string, number> = {}
  for (const c of clients ?? []) {
    const lang = c.language ?? 'Unknown'
    langMap[lang] = (langMap[lang] ?? 0) + 1
  }
  const languageData = Object.entries(langMap)
    .map(([language, count]) => ({ language, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  return {
    servicesByType,
    monthlyTrend,
    languageData,
    totalClients: totalClients ?? 0,
    totalServices: totalServices ?? 0,
  }
}

export default async function ReportsPage() {
  const { servicesByType, monthlyTrend, languageData, totalClients, totalServices } =
    await getReportData()

  const avgServicesPerClient =
    totalClients > 0 ? (totalServices / totalClients).toFixed(1) : '0'

  const topService = servicesByType[0]?.type ?? '—'

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Reports</h1>
        <p className="text-sm text-slate-500 mt-1">Program outcomes and service analytics</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SummaryCard label="Active Clients" value={totalClients} />
        <SummaryCard label="Total Services" value={totalServices} />
        <SummaryCard label="Avg Services / Client" value={avgServicesPerClient} />
        <SummaryCard label="Top Service Type" value={topService} small />
      </div>

      {/* Services by type */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Services by Type</CardTitle>
        </CardHeader>
        <CardContent>
          {servicesByType.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center">No services logged yet.</p>
          ) : (
            <ServicesByTypeChart data={servicesByType} />
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Monthly Service Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyTrendChart data={monthlyTrend} />
          </CardContent>
        </Card>

        {/* Language distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Clients by Language</CardTitle>
          </CardHeader>
          <CardContent>
            {languageData.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">No client data yet.</p>
            ) : (
              <LanguageChart data={languageData} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  small,
}: {
  label: string
  value: number | string
  small?: boolean
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-4">
      <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
      <p className={`font-bold text-slate-900 ${small ? 'text-base leading-tight' : 'text-2xl'}`}>
        {value}
      </p>
    </div>
  )
}
