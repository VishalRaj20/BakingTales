import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Package, Users, ShoppingBag, LayoutDashboard, LogOut } from 'lucide-react'
import { MobileSidebar } from '@/components/admin/mobile-sidebar'

// Revalidate on every request ideally, or force dynamic
export const dynamic = 'force-dynamic'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect('/auth/login')
    }

    // Check role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

    if (!profile || (profile.role !== 'admin' && profile.role !== 'staff')) {
        redirect('/')
    }

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, roles: ['admin', 'staff'] },
        { name: 'Products', href: '/admin/products', icon: Package, roles: ['admin'] },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingBag, roles: ['admin', 'staff'] },
        { name: 'Users', href: '/admin/users', icon: Users, roles: ['admin'] },
    ]

    const filteredNavItems = navItems.filter(item => item.roles.includes(profile.role))

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Desktop Sidebar */}
            <aside className="w-64 bg-white border-r hidden md:flex flex-col fixed inset-y-0 z-50">
                <div className="p-6 border-b h-20 flex flex-col justify-center">
                    <Link href="/" className="text-xl font-bold text-primary">
                        Baking Admin
                    </Link>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1 bg-muted rounded w-fit">
                        {profile.role}
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {filteredNavItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t bg-white">
                    <Link href="/auth/login" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 rounded-lg hover:bg-red-50">
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col md:pl-64 min-h-screen">
                {/* Mobile Header */}
                <header className="md:hidden bg-white border-b h-16 flex items-center justify-between px-4 sticky top-0 z-40">
                    <span className="font-bold text-lg">Baking Admin</span>
                    <MobileSidebar role={profile.role} />
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
