'use client'

import { useState, useTransition } from 'react'
import { Sparkles, Loader2, RefreshCw } from 'lucide-react'
import { generateClientSummaryAction } from '@/app/actions/ai'

export default function AiSummaryWidget({ clientId }: { clientId: string }) {
  const [summary, setSummary] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function generate() {
    setError(null)
    startTransition(async () => {
      try {
        const text = await generateClientSummaryAction(clientId)
        setSummary(text)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Summary generation failed')
      }
    })
  }

  if (!summary && !isPending && !error) {
    return (
      <button
        onClick={generate}
        className="inline-flex items-center gap-1.5 rounded-md border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-100 transition-colors"
      >
        <Sparkles className="h-3.5 w-3.5" />
        AI Summary
      </button>
    )
  }

  return (
    <div className="rounded-md border border-purple-200 bg-purple-50 px-4 py-3 text-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-purple-700">
          <Sparkles className="h-3.5 w-3.5" />
          AI Case Summary
        </span>
        {!isPending && (
          <button
            onClick={generate}
            className="text-purple-400 hover:text-purple-700 transition-colors"
            title="Regenerate"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {isPending ? (
        <span className="flex items-center gap-2 text-xs text-purple-600">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Generating summary…
        </span>
      ) : error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : (
        <p className="text-slate-700 leading-relaxed">{summary}</p>
      )}
    </div>
  )
}
