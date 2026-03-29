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
  SlidersHorizontal,
  ShieldCheck,
  LogOut,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { type Role } from '@/types'
import LanguageSwitcher from './LanguageSwitcher'
import { useI18n } from '@/lib/i18n/context'

export default function Sidebar({
  role,
  userName,
}: {
  role: Role
  userName: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { t } = useI18n()

  const navItems = [
    { href: '/dashboard', label: t('nav_dashboard'), icon: LayoutDashboard },
    { href: '/clients', label: t('nav_clients'), icon: Users },
    { href: '/services', label: t('nav_services'), icon: ClipboardList },
    { href: '/schedule', label: t('nav_schedule'), icon: CalendarDays },
    { href: '/reports', label: t('nav_reports'), icon: BarChart3 },
  ]

  const adminItems = [
    { href: '/admin/fields', label: t('nav_custom_fields'), icon: SlidersHorizontal },
    { href: '/admin/users', label: t('nav_users'), icon: Settings },
    { href: '/admin/audit', label: t('nav_audit'), icon: ShieldCheck },
  ]

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <aside className="flex h-full w-60 flex-col border-r bg-white px-3 py-4 shrink-0">
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
              isActive(href)
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
              {t('nav_admin')}
            </p>
            {adminItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive(href)
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

      <div className="border-t pt-3 mt-2 space-y-1">
        <LanguageSwitcher />
        <div className="px-3 py-2">
          <p className="text-xs font-medium text-slate-900 truncate">{userName}</p>
          <p className="text-xs text-slate-400 capitalize">{role}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          {t('nav_sign_out')}
        </button>
      </div>
    </aside>
  )
}
