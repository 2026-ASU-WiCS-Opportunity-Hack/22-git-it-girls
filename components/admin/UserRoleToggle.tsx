'use client'

import { useTransition } from 'react'
import { updateUserRoleAction } from '@/app/actions/admin'

export default function UserRoleToggle({
  userId,
  currentRole,
  isSelf,
}: {
  userId: string
  currentRole: 'admin' | 'staff'
  isSelf: boolean
}) {
  const [isPending, startTransition] = useTransition()

  if (isSelf) {
    return (
      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 border border-blue-200">
        {currentRole} (you)
      </span>
    )
  }

  const nextRole = currentRole === 'admin' ? 'staff' : 'admin'

  return (
    <div className="flex items-center gap-2">
      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border ${
        currentRole === 'admin'
          ? 'bg-purple-50 text-purple-700 border-purple-200'
          : 'bg-slate-100 text-slate-600 border-slate-200'
      }`}>
        {currentRole}
      </span>
      <button
        onClick={() =>
          startTransition(async () => {
            await updateUserRoleAction(userId, nextRole)
          })
        }
        disabled={isPending}
        className="text-xs text-blue-600 hover:underline disabled:opacity-50"
      >
        {isPending ? 'Saving…' : `Make ${nextRole}`}
      </button>
    </div>
  )
}
