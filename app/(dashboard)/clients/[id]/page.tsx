import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, Phone, Mail, MapPin, Calendar, ClipboardList, Edit } from 'lucide-react'
import type { FieldDefinition, ServiceEntry } from '@/types'
import AiSummaryWidget from '@/components/clients/AiSummaryWidget'

export default async function ClientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: client }, { data: services }, { data: fieldDefs }] = await Promise.all([
    supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single(),
    supabase
      .from('service_entries')
      .select(`
        id,
        service_type,
        service_date,
        notes,
        follow_up_date,
        ai_summary,
        created_at,
        profiles (full_name)
      `)
      .eq('client_id', id)
      .order('service_date', { ascending: false }),
    supabase
      .from('field_definitions')
      .select('*')
      .order('sort_order', { ascending: true }),
  ])

  if (!client) notFound()

  const fieldDefMap = Object.fromEntries(
    ((fieldDefs ?? []) as FieldDefinition[]).map((f) => [f.field_key, f.label])
  )

  const age = client.date_of_birth
    ? Math.floor(
        (Date.now() - new Date(client.date_of_birth).getTime()) /
          (365.25 * 24 * 60 * 60 * 1000)
      )
    : null

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      {/* Back */}
      <Link
        href="/clients"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Clients
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-slate-900">
              {client.first_name} {client.last_name}
            </h1>
            <Badge variant={client.is_active ? 'default' : 'secondary'}>
              {client.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          {age !== null && (
            <p className="text-sm text-slate-500 mt-0.5">Age {age}</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <AiSummaryWidget clientId={client.id} />
          <Link
            href={`/services/new?clientId=${client.id}`}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <ClipboardList className="h-4 w-4" />
            Log Service
          </Link>
          <Link
            href={`/clients/${client.id}/edit`}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Demographics */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Contact & Demographics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {client.phone && (
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                  {client.phone}
                </div>
              )}
              {client.email && (
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                  {client.email}
                </div>
              )}
              {client.address && (
                <div className="flex items-start gap-2 text-slate-700">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  {client.address}
                </div>
              )}
              {client.date_of_birth && (
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                  {new Date(client.date_of_birth + 'T00:00:00').toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              )}
              <div className="pt-2 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-slate-400">Gender</p>
                  <p className="font-medium text-slate-700">{client.gender ?? '—'}</p>
                </div>
                <div>
                  <p className="text-slate-400">Language</p>
                  <p className="font-medium text-slate-700">{client.language ?? '—'}</p>
                </div>
                <div>
                  <p className="text-slate-400">Household</p>
                  <p className="font-medium text-slate-700">
                    {client.household_size ? `${client.household_size} people` : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Client Since</p>
                  <p className="font-medium text-slate-700">
                    {new Date(client.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Custom fields */}
          {client.custom_fields && Object.keys(client.custom_fields).length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Custom Fields</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {Object.entries(client.custom_fields as Record<string, unknown>).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-2 gap-1">
                    <p className="text-slate-400">{fieldDefMap[key] ?? key.replace(/_/g, ' ')}</p>
                    <p className="font-medium text-slate-700">
                      {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Internal notes */}
          {client.notes && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700 whitespace-pre-line">{client.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Service History */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">
                  Service History ({services?.length ?? 0})
                </CardTitle>
                <Link
                  href={`/services/new?clientId=${client.id}`}
                  className="text-xs text-blue-600 hover:underline"
                >
                  + Log service
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {!services?.length ? (
                <p className="text-sm text-slate-500 py-6 text-center">
                  No services logged yet.{' '}
                  <Link
                    href={`/services/new?clientId=${client.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Log the first one.
                  </Link>
                </p>
              ) : (
                <ol className="relative border-l border-slate-200 ml-3 space-y-0">
                  {(services as any[]).map((entry) => (
                    <li key={entry.id} className="mb-6 ml-6">
                      <span className="absolute -left-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 ring-4 ring-white">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                      </span>
                      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {entry.service_type}
                          </Badge>
                          <time className="text-xs text-slate-400 shrink-0">
                            {new Date(entry.service_date + 'T00:00:00').toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </time>
                        </div>
                        {entry.notes && (
                          <p className="text-sm text-slate-700 mt-1 whitespace-pre-line">
                            {entry.notes}
                          </p>
                        )}
                        {entry.ai_summary && (
                          <div className="mt-2 rounded-md bg-blue-50 border border-blue-100 px-3 py-2 text-xs text-blue-800">
                            <span className="font-semibold">AI Summary: </span>
                            {entry.ai_summary}
                          </div>
                        )}
                        <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                          {entry.profiles?.full_name && (
                            <span>by {entry.profiles.full_name}</span>
                          )}
                          {entry.follow_up_date && (
                            <span className="text-amber-600 font-medium">
                              Follow-up:{' '}
                              {new Date(entry.follow_up_date + 'T00:00:00').toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
