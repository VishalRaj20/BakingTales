'use client'

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, Package, Users, ShoppingBag, LayoutDashboard, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

interface MobileSidebarProps {
    role: string
}

export function MobileSidebar({ role }: MobileSidebarProps) {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, roles: ['admin', 'staff'] },
        { name: 'Products', href: '/admin/products', icon: Package, roles: ['admin'] },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingBag, roles: ['admin', 'staff'] },
        { name: 'Users', href: '/admin/users', icon: Users, roles: ['admin'] },
    ]

    const filteredNavItems = navItems.filter(item => item.roles.includes(role))

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="w-6 h-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b">
                        <SheetTitle className="text-xl font-bold text-primary">
                            Baking Admin
                        </SheetTitle>
                        <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1 bg-muted rounded w-fit">
                            {role}
                        </div>
                    </div>

                    <nav className="flex-1 p-4 space-y-2">
                        {filteredNavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${pathname === item.href
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="p-4 border-t">
                        <Link href="/auth/login" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 rounded-lg hover:bg-red-50">
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </Link>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
