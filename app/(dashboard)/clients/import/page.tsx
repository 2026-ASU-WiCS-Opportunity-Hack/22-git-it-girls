import ClientImport from '@/components/clients/ClientImport'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function ImportClientsPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      <div>
        <Link
          href="/clients"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-3"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Clients
        </Link>
        <h1 className="text-2xl font-semibold text-slate-900">Import Clients from CSV</h1>
        <p className="text-sm text-slate-500 mt-1">
          Upload a CSV file to bulk-import clients. Required columns:{' '}
          <code className="bg-slate-100 px-1 rounded text-xs">first_name</code>,{' '}
          <code className="bg-slate-100 px-1 rounded text-xs">last_name</code>.
          Optional:{' '}
          <code className="bg-slate-100 px-1 rounded text-xs">date_of_birth</code>,{' '}
          <code className="bg-slate-100 px-1 rounded text-xs">phone</code>,{' '}
          <code className="bg-slate-100 px-1 rounded text-xs">email</code>,{' '}
          <code className="bg-slate-100 px-1 rounded text-xs">gender</code>,{' '}
          <code className="bg-slate-100 px-1 rounded text-xs">language</code>,{' '}
          <code className="bg-slate-100 px-1 rounded text-xs">household_size</code>,{' '}
          <code className="bg-slate-100 px-1 rounded text-xs">address</code>,{' '}
          <code className="bg-slate-100 px-1 rounded text-xs">notes</code>.
        </p>
      </div>
      <ClientImport />
    </div>
  )
}
