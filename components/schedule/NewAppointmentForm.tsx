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

type ClientOption = { id: string; first_name: string; last_name: string }

export default function NewAppointmentForm({
  action,
  clients,
}: {
  action: (formData: FormData) => Promise<void>
  clients: ClientOption[]
}) {
  const now = new Date()
  const localDatetime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)

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
        <Select name="client_id" required>
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

      <div className="space-y-1.5">
        <Label htmlFor="scheduled_at">Date &amp; Time *</Label>
        <Input
          id="scheduled_at"
          name="scheduled_at"
          type="datetime-local"
          defaultValue={localDatetime}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Purpose of visit, what to bring, special instructions…"
          rows={3}
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? 'Scheduling…' : 'Schedule Appointment'}
        </Button>
      </div>
    </form>
  )
}
