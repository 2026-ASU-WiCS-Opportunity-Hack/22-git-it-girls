'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Users,
  ClipboardList,
  LayoutDashboard,
  CalendarDays,
  BarChart3,
  Settings,
  ShieldCheck,
  LogOut,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { type Role } from '@/types'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/services', label: 'Services', icon: ClipboardList },
  { href: '/schedule', label: 'Schedule', icon: CalendarDays },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
]

const adminItems = [
  { href: '/admin/users', label: 'Users', icon: Settings },
  { href: '/admin/audit', label: 'Audit Log', icon: ShieldCheck },
]

export default function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="flex h-full w-60 flex-col border-r bg-white px-3 py-4">
      <div className="mb-6 px-3">
        <span className="text-xl font-bold text-blue-700">CareTrack</span>
        <p className="text-xs text-muted-foreground">Nonprofit Case Management</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:bg-slate-100'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}

        {role === 'admin' && (
          <>
            <div className="my-2 border-t" />
            <p className="px-3 py-1 text-xs font-semibold uppercase text-muted-foreground">
              Admin
            </p>
            {adminItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  pathname === href
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </>
        )}
      </nav>

      <button
        onClick={handleSignOut}
        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </aside>
  )
}
