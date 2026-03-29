import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/layout/Sidebar'
import { I18nProvider } from '@/lib/i18n/context'
import { getLocale } from '@/lib/i18n/server'
import type { Role } from '@/types'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const [{ data: profile }, locale] = await Promise.all([
    supabase.from('profiles').select('role, full_name').eq('id', user.id).single(),
    getLocale(),
  ])

  const role: Role = (profile?.role as Role) ?? 'staff'

  return (
    <I18nProvider initialLocale={locale}>
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <Sidebar role={role} userName={profile?.full_name ?? user.email ?? ''} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </I18nProvider>
  )
}
