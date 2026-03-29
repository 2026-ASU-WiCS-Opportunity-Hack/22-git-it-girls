'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Loader2, X } from 'lucide-react'

export default function PhotoIntakeWidget() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    const url = URL.createObjectURL(file)
    setPreview(url)
    startTransition(async () => {
      const fd = new FormData()
      fd.append('image', file)
      try {
        const res = await fetch('/api/ai/photo-intake', { method: 'POST', body: fd })
        const json = await res.json()
        if (!res.ok) {
          setError(json.error ?? 'Extraction failed')
          return
        }
        const params = new URLSearchParams()
        const e = json.extracted as Record<string, unknown>
        for (const [k, v] of Object.entries(e)) {
          if (v !== undefined && v !== null && String(v).trim()) {
            params.set(k, String(v))
          }
        }
        router.push(`/clients/new?${params.toString()}`)
      } catch {
        setError('Network error. Please try again.')
      }
    })
  }

  function reset() {
    setPreview(null)
    setError(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 flex items-start gap-4">
      <div className="rounded-full bg-blue-100 p-2 shrink-0">
        <Camera className="h-5 w-5 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-blue-800">Scan Document with AI</p>
        <p className="text-xs text-blue-600 mt-0.5">
          Upload a photo of an ID, referral letter, or intake form — Claude will extract the fields
          for you.
        </p>

        {error && (
          <p className="mt-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">
            {error}
          </p>
        )}

        <div className="mt-3 flex items-center gap-3">
          {isPending ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-blue-700">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Extracting fields…
            </span>
          ) : preview ? (
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          ) : (
            <>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFile}
                className="hidden"
                id="photo-intake-upload"
              />
              <label
                htmlFor="photo-intake-upload"
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
              >
                <Camera className="h-3.5 w-3.5" />
                Upload photo
              </label>
            </>
          )}
        </div>
      </div>

      {preview && !isPending && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt="Document preview"
          className="h-16 w-16 rounded object-cover border border-blue-200 shrink-0"
        />
      )}
    </div>
  )
}
