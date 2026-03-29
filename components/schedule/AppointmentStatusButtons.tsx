'use client'

import { useTransition } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { updateAppointmentStatusAction } from '@/app/actions/appointments'

export default function AppointmentStatusButtons({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  function update(status: 'completed' | 'cancelled') {
    startTransition(async () => {
      await updateAppointmentStatusAction(id, status)
    })
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => update('completed')}
        disabled={isPending}
        title="Mark completed"
        className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-50 transition-colors disabled:opacity-50"
      >
        <CheckCircle className="h-3.5 w-3.5" />
        Done
      </button>
      <button
        onClick={() => update('cancelled')}
        disabled={isPending}
        title="Cancel"
        className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
      >
        <XCircle className="h-3.5 w-3.5" />
        Cancel
      </button>
    </div>
  )
}
