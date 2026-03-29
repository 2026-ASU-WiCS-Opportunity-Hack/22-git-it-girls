'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Sparkles, Loader2 } from 'lucide-react'
import { aiSearchClientsAction } from '@/app/actions/ai'

export default function AiSearchBar({ defaultQuery }: { defaultQuery?: string }) {
  const [query, setQuery] = useState(defaultQuery ?? '')
  const [aiMode, setAiMode] = useState(false)
  const [explanation, setExplanation] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleRegularSearch(e: React.FormEvent) {
    e.preventDefault()
    setExplanation(null)
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    router.push(`/clients?${params.toString()}`)
  }

  function handleAiSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setError(null)
    setExplanation(null)

    startTransition(async () => {
      try {
        const result = await aiSearchClientsAction(query.trim())
        setExplanation(result.explanation)

        const params = new URLSearchParams()
        const f = result.sql_filters
        if (f.name) params.set('q', f.name)
        if (f.service_types?.length) params.set('service_type', f.service_types[0])
        if (f.language) params.set('language', f.language)
        params.set('ai', '1')

        router.push(`/clients?${params.toString()}`)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'AI search failed')
      }
    })
  }

  return (
    <div className="space-y-2">
      <form
        onSubmit={aiMode ? handleAiSearch : handleRegularSearch}
        className="flex items-center gap-2"
      >
        <div className="relative flex-1 max-w-sm">
          {isPending ? (
            <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500 animate-spin pointer-events-none" />
          ) : (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          )}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              aiMode
                ? 'e.g. "clients needing housing help in Spanish"'
                : 'Search by name, phone, email…'
            }
            className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            setAiMode(!aiMode)
            setExplanation(null)
            setError(null)
          }}
          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-colors border ${
            aiMode
              ? 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700'
              : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
          }`}
          title={aiMode ? 'Switch to regular search' : 'Switch to AI search'}
        >
          <Sparkles className="h-3.5 w-3.5" />
          AI
        </button>
      </form>

      {explanation && (
        <p className="text-xs text-purple-700 flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 shrink-0" />
          {explanation}
        </p>
      )}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}
