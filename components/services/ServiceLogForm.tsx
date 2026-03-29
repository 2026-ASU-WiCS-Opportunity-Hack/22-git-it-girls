'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SERVICE_TYPES } from '@/types'

type ClientOption = { id: string; first_name: string; last_name: string }

type Props = {
  action: (formData: FormData) => Promise<void>
  clients: ClientOption[]
  defaultClientId?: string
}

export default function ServiceLogForm({ action, clients, defaultClientId }: Props) {
  const today = new Date().toISOString().split('T')[0]

  const [error, formAction, pending] = useActionState(
    async (_prev: string | null, formData: FormData) => {
      try {
        await action(formData)
        return null
      } catch (e: unknown) {
        return e instanceof Error ? e.message : 'Something went wrong'
      }
    },
    null
  )

  return (
    <form action={formAction} className="space-y-5">
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="client_id">Client *</Label>
        <Select name="client_id" defaultValue={defaultClientId} required>
          <SelectTrigger id="client_id">
            <SelectValue placeholder="Select a client…" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.last_name}, {c.first_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="service_type">Service Type *</Label>
          <Select name="service_type" required>
            <SelectTrigger id="service_type">
              <SelectValue placeholder="Select type…" />
            </SelectTrigger>
            <SelectContent>
              {SERVICE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="service_date">Service Date *</Label>
          <Input
            id="service_date"
            name="service_date"
            type="date"
            defaultValue={today}
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Session Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="What happened during this visit? Any observations, referrals, outcomes…"
          rows={5}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="follow_up_date">Follow-up Date</Label>
        <Input
          id="follow_up_date"
          name="follow_up_date"
          type="date"
          min={today}
        />
        <p className="text-xs text-slate-400">Leave blank if no follow-up needed</p>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : 'Log Service'}
        </Button>
      </div>
    </form>
  )
}
