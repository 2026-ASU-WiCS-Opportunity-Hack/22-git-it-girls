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
import type { Client, FieldDefinition } from '@/types'

type Props = {
  action: (formData: FormData) => Promise<void>
  defaultValues?: Partial<Client>
  submitLabel?: string
  customFields?: FieldDefinition[]
}

export default function ClientForm({
  action,
  defaultValues,
  submitLabel = 'Save Client',
  customFields = [],
}: Props) {
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
    <form action={formAction} className="space-y-6">
      {defaultValues?.id && (
        <input type="hidden" name="id" value={defaultValues.id} />
      )}

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Name */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="first_name">First Name *</Label>
          <Input
            id="first_name"
            name="first_name"
            defaultValue={defaultValues?.first_name}
            required
            placeholder="Maria"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="last_name">Last Name *</Label>
          <Input
            id="last_name"
            name="last_name"
            defaultValue={defaultValues?.last_name}
            required
            placeholder="Gonzalez"
          />
        </div>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={defaultValues?.phone ?? ''}
            placeholder="(602) 555-0100"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={defaultValues?.email ?? ''}
            placeholder="client@example.com"
          />
        </div>
      </div>

      {/* Demographics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="date_of_birth">Date of Birth</Label>
          <Input
            id="date_of_birth"
            name="date_of_birth"
            type="date"
            defaultValue={defaultValues?.date_of_birth ?? ''}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="gender">Gender</Label>
          <Select name="gender" defaultValue={defaultValues?.gender ?? ''}>
            <SelectTrigger id="gender">
              <SelectValue placeholder="Select…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Non-binary">Non-binary</SelectItem>
              <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="household_size">Household Size</Label>
          <Input
            id="household_size"
            name="household_size"
            type="number"
            min="1"
            max="20"
            defaultValue={defaultValues?.household_size ?? ''}
            placeholder="1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="language">Preferred Language</Label>
          <Select name="language" defaultValue={defaultValues?.language ?? 'English'}>
            <SelectTrigger id="language">
              <SelectValue placeholder="Select…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
              <SelectItem value="Arabic">Arabic</SelectItem>
              <SelectItem value="Somali">Somali</SelectItem>
              <SelectItem value="Chinese">Chinese</SelectItem>
              <SelectItem value="Korean">Korean</SelectItem>
              <SelectItem value="Vietnamese">Vietnamese</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            defaultValue={(defaultValues as any)?.address ?? ''}
            placeholder="123 Main St, Phoenix, AZ"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Internal Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={(defaultValues as any)?.notes ?? ''}
          placeholder="Any context that would help staff members…"
          rows={3}
        />
      </div>

      {/* Custom fields */}
      {customFields.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-700 border-t pt-4">Custom Fields</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {customFields.map((field) => {
              const stored = (defaultValues?.custom_fields as Record<string, unknown> | undefined)?.[field.field_key]
              const name = `custom_field__${field.field_key}`

              if (field.field_type === 'boolean') {
                return (
                  <div key={field.id} className="space-y-1.5">
                    <Label htmlFor={name}>
                      {field.label}{field.is_required ? ' *' : ''}
                    </Label>
                    <select
                      id={name}
                      name={name}
                      required={field.is_required}
                      defaultValue={stored !== undefined ? String(stored) : ''}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="">Select…</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                )
              }

              return (
                <div key={field.id} className="space-y-1.5">
                  <Label htmlFor={name}>
                    {field.label}{field.is_required ? ' *' : ''}
                  </Label>
                  <Input
                    id={name}
                    name={name}
                    type={field.field_type === 'number' ? 'number' : field.field_type === 'date' ? 'date' : 'text'}
                    required={field.is_required}
                    defaultValue={stored !== undefined ? String(stored) : ''}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
