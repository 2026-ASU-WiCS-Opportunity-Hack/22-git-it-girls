'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Sidebar from './Sidebar'
import type { Role } from '@/types'

export default function MobileHeader({
  role,
  userName,
}: {
  role: Role
  userName: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Top bar — mobile only */}
      <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden shrink-0">
        <span className="text-lg font-bold text-blue-700">CareTrack</span>
        <button
          onClick={() => setOpen(true)}
          className="rounded-md p-2 text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="relative h-full">
          <button
            onClick={() => setOpen(false)}
            className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
          <Sidebar role={role} userName={userName} />
        </div>
      </div>
    </>
  )
}
