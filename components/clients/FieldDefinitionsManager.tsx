'use client'

import { useActionState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Trash2 } from 'lucide-react'
import { createFieldAction, deleteFieldAction } from '@/app/actions/fields'
import type { FieldDefinition, FieldType } from '@/types'

const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  text: 'Text',
  number: 'Number',
  date: 'Date',
  boolean: 'Yes / No',
}

export default function FieldDefinitionsManager({
  fields,
}: {
  fields: FieldDefinition[]
}) {
  const [error, formAction, pending] = useActionState(
    async (_prev: string | null, formData: FormData) => {
      try {
        await createFieldAction(formData)
        return null
      } catch (e: unknown) {
        return e instanceof Error ? e.message : 'Something went wrong'
      }
    },
    null
  )

  const [isDeleting, startDelete] = useTransition()

  function handleDelete(id: string) {
    startDelete(async () => {
      await deleteFieldAction(id)
    })
  }

  return (
    <div className="space-y-6">
      {/* Existing fields */}
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        {fields.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-slate-500">
            No custom fields defined yet. Add one below.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left">
                <th className="px-4 py-3 font-medium text-slate-600">Label</th>
                <th className="px-4 py-3 font-medium text-slate-600">Key</th>
                <th className="px-4 py-3 font-medium text-slate-600">Type</th>
                <th className="px-4 py-3 font-medium text-slate-600">Required</th>
                <th className="px-4 py-3 font-medium text-slate-600 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fields.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{f.label}</td>
                  <td className="px-4 py-3">
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
                      {f.field_key}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {FIELD_TYPE_LABELS[f.field_type]}
                  </td>
                  <td className="px-4 py-3">
                    {f.is_required ? (
                      <Badge variant="default" className="text-xs">Required</Badge>
                    ) : (
                      <span className="text-slate-400 text-xs">Optional</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(f.id)}
                      disabled={isDeleting}
                      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add field form */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 space-y-4">
        <h2 className="text-sm font-semibold text-slate-800">Add Custom Field</h2>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form action={formAction} className="grid grid-cols-1 gap-4 sm:grid-cols-4 items-end">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="label">Field Label *</Label>
            <Input
              id="label"
              name="label"
              required
              placeholder="e.g. Case Worker ID"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="field_type">Type</Label>
            <Select name="field_type" defaultValue="text">
              <SelectTrigger id="field_type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="boolean">Yes / No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="is_required">Required?</Label>
            <Select name="is_required" defaultValue="false">
              <SelectTrigger id="is_required">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">Optional</SelectItem>
                <SelectItem value="true">Required</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-4 flex justify-end">
            <Button type="submit" disabled={pending}>
              {pending ? 'Adding…' : 'Add Field'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
