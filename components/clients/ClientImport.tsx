'use client'

import { useRef, useState, useTransition } from 'react'
import Papa from 'papaparse'
import { Button } from '@/components/ui/button'
import { Upload, CheckCircle, AlertCircle } from 'lucide-react'
import { importClientsAction, type ImportRow, type ImportResult } from '@/app/actions/import'

const EXPECTED_COLS = [
  'first_name',
  'last_name',
  'date_of_birth',
  'phone',
  'email',
  'gender',
  'language',
  'household_size',
  'address',
  'notes',
]

const PREVIEW_LIMIT = 5

export default function ClientImport() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [rows, setRows] = useState<ImportRow[]>([])
  const [parseError, setParseError] = useState<string | null>(null)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setResult(null)
    setParseError(null)
    setRows([])

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const headers = results.meta.fields ?? []
        if (!headers.includes('first_name') || !headers.includes('last_name')) {
          setParseError('CSV must have at least "first_name" and "last_name" columns.')
          return
        }
        setRows(results.data as unknown as ImportRow[])
      },
      error(err) {
        setParseError(err.message)
      },
    })
  }

  function handleImport() {
    startTransition(async () => {
      try {
        const res = await importClientsAction(rows)
        setResult(res)
        setRows([])
        if (fileRef.current) fileRef.current.value = ''
      } catch (e: unknown) {
        setParseError(e instanceof Error ? e.message : 'Import failed')
      }
    })
  }

  return (
    <div className="space-y-5">
      {/* Upload zone */}
      <div className="rounded-lg border-2 border-dashed border-slate-300 bg-white p-8 text-center hover:border-blue-400 transition-colors">
        <Upload className="mx-auto h-8 w-8 text-slate-400 mb-3" />
        <p className="text-sm font-medium text-slate-700 mb-1">Choose a CSV file</p>
        <p className="text-xs text-slate-400 mb-4">Max 5 MB · UTF-8 encoded</p>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          onChange={handleFile}
          className="hidden"
          id="csv-upload"
        />
        <label
          htmlFor="csv-upload"
          className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Browse…
        </label>
      </div>

      {parseError && (
        <div className="flex items-start gap-2 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          {parseError}
        </div>
      )}

      {result && (
        <div className="flex items-start gap-2 rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
          <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">{result.inserted} client{result.inserted !== 1 ? 's' : ''} imported successfully.</p>
            {result.errors.length > 0 && (
              <ul className="mt-1 list-disc pl-4 text-xs text-red-700 space-y-0.5">
                {result.errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Preview */}
      {rows.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-700">
              Preview — {rows.length} row{rows.length !== 1 ? 's' : ''} detected
              {rows.length > PREVIEW_LIMIT && ` (showing first ${PREVIEW_LIMIT})`}
            </p>
            <Button onClick={handleImport} disabled={isPending}>
              {isPending ? 'Importing…' : `Import ${rows.length} Client${rows.length !== 1 ? 's' : ''}`}
            </Button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left">
                  {EXPECTED_COLS.filter((col) =>
                    Object.keys(rows[0] ?? {}).includes(col)
                  ).map((col) => (
                    <th key={col} className="px-3 py-2 font-medium text-slate-600 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.slice(0, PREVIEW_LIMIT).map((row, i) => (
                  <tr key={i}>
                    {EXPECTED_COLS.filter((col) =>
                      Object.keys(rows[0] ?? {}).includes(col)
                    ).map((col) => (
                      <td key={col} className="px-3 py-2 text-slate-600 max-w-[140px] truncate">
                        {(row as unknown as Record<string, string>)[col] ?? ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
