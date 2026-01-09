'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ShoppingCart,
    Heart,
    User,
    Menu,
    X,
    ChevronDown,
    Search
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useCart } from '@/components/providers/cart-provider'
import { createClient } from '@/utils/supabase/client'
import { type User as SupabaseUser } from '@supabase/supabase-js'

type UserWithRole = SupabaseUser & { role?: 'user' | 'admin' }

export function Header() {
    const supabase = createClient()
    const router = useRouter()
    const pathname = usePathname()
    const { count } = useCart()

    const [user, setUser] = React.useState<UserWithRole | null>(null)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const [mobileOpen, setMobileOpen] = React.useState(false)
    const [searchOpen, setSearchOpen] = React.useState(false)
    const [search, setSearch] = React.useState('')

    const isHome = pathname === '/'

    /* ---------------------------------- Effects ---------------------------------- */

    React.useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 0)
        window.addEventListener('scroll', onScroll)

        const fetchProfile = async (userId: string) => {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single()
            return profile?.role ?? 'user'
        }

        const initializeUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user) {
                const role = await fetchProfile(session.user.id)
                setUser({ ...session.user, role })
            } else {
                setUser(null)
            }
        }

        initializeUser()

        const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                // Optimization: Only fetch profile if user changed or we don't have it
                // For safety/simplicity, we fetch to ensure role is up to date
                const role = await fetchProfile(session.user.id)
                setUser({ ...session.user, role })
            } else {
                setUser(null)
            }
        })

        return () => {
            window.removeEventListener('scroll', onScroll)
            listener.subscription.unsubscribe()
        }
    }, [])

    /* --------------------------------- Handlers ---------------------------------- */

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (!search.trim()) return
        router.push(`/shop?q=${encodeURIComponent(search)}`)
        setSearchOpen(false)
    }

    /* -------------------------------- Navigation -------------------------------- */

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Menu', href: '/menu' },
        { name: 'Products', href: '/shop', dropdown: 'products' },
        { name: 'Occasions', href: '/shop?tag=occasions', dropdown: 'occasions' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' }
    ]

    const textColor = isHome && !isScrolled
        ? 'text-black/90 hover:text-black'
        : 'text-black/80 hover:text-black'

    /* ---------------------------------- Render ---------------------------------- */

    return (
        <header
            className={cn(
                'fixed inset-x-0 top-0 z-50 transition-all',
                isHome && !isScrolled
                    ? 'bg-transparent py-4'
                    : 'bg-white/80 backdrop-blur-md shadow-sm py-2'
            )}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-3xl font-bold text-primary">
                    Baking Tales
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map(link => (
                        <div key={link.name} className="relative group">
                            <Link
                                href={link.href}
                                className={cn(
                                    'flex items-center gap-1 font-semibold transition-colors',
                                    pathname === link.href ? 'text-primary' : textColor
                                )}
                            >
                                {link.name}
                                {link.dropdown && <ChevronDown className="w-4 h-4" />}
                            </Link>

                            {link.dropdown && (
                                <div className="absolute top-full left-0 pt-4 w-48 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200 z-50">
                                    <div className="bg-white rounded-xl border shadow-lg overflow-hidden">
                                        <div className="p-2 space-y-1 text-sm">
                                            {link.dropdown === 'products' && (
                                                <>
                                                    <Link href="/shop?category=cakes" className="block px-3 py-2 rounded-lg hover:bg-muted transition-colors">Cakes</Link>
                                                    <Link href="/shop?category=pastries" className="block px-3 py-2 rounded-lg hover:bg-muted transition-colors">Pastries</Link>
                                                    <Link href="/shop?category=cookies" className="block px-3 py-2 rounded-lg hover:bg-muted transition-colors">Cookies</Link>
                                                    <Link href="/shop?category=brownies" className="block px-3 py-2 rounded-lg hover:bg-muted transition-colors">Brownies</Link>
                                                </>
                                            )}
                                            {link.dropdown === 'occasions' && (
                                                <>
                                                    <Link href="/shop?tag=Birthday" className="block px-3 py-2 rounded-lg hover:bg-muted transition-colors">Birthday</Link>
                                                    <Link href="/shop?tag=Anniversary" className="block px-3 py-2 rounded-lg hover:bg-muted transition-colors">Anniversary</Link>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-10">
                    {/* Search */}
                    <AnimatePresence>
                        {searchOpen && (
                            <motion.form
                                onSubmit={handleSearch}
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 220, opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                className="relative overflow-hidden"
                            >
                                <Input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search cakes..."
                                    className="h-9 pr-9 rounded-full"
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2">
                                    <Search className="w-4 h-4" />
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    <Button variant="ghost" size="icon" onClick={() => setSearchOpen(!searchOpen)}>
                        {searchOpen ? <X /> : <Search />}
                    </Button>

                    <Link href="/wishlist"><Heart /></Link>

                    <Link href="/cart" className="relative">
                        <ShoppingCart />
                        {count > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                                {count}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <Link href="/account" className="relative">
                            <User />
                            {user.role === 'admin' && (
                                <span className="absolute -bottom-2 -right-3 bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                                    ADMIN
                                </span>
                            )}
                        </Link>
                    ) : (
                        <Link href="/auth/login" className={cn("font-medium hover:text-primary transition-colors", textColor)}>
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
                    {mobileOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden bg-white border-t"
                    >
                        <div className="container px-4 py-4 space-y-4">
                            {navLinks.map(link => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="block text-lg font-medium"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <div className="flex justify-around pt-4">
                                <Heart />
                                <ShoppingCart />
                                {user ? (
                                    <Link href="/account" onClick={() => setMobileOpen(false)}><User /></Link>
                                ) : (
                                    <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="font-medium">Login</Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
