import { createClient } from '@/utils/supabase/server'
import { Users, Banknote, ShoppingBag, Package, TrendingUp } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    const supabase = await createClient()

    // parallel fetch
    const [productsRes, ordersRes, revenueRes, usersRes] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total_price').eq('payment_status', 'paid'), // Revenue from all PAID orders
        supabase.from('profiles').select('*', { count: 'exact', head: true })
    ])

    const productsCount = productsRes.count || 0
    const ordersCount = ordersRes.count || 0
    const usersCount = usersRes.count || 0
    const totalRevenue = revenueRes.data?.reduce((acc, order) => acc + Number(order.total_price), 0) || 0
    const avgOrderValue = ordersCount > 0 ? totalRevenue / ordersCount : 0

    const stats = [
        {
            title: 'Total Revenue',
            value: `₹${totalRevenue.toLocaleString()}`,
            icon: Banknote,
            description: 'Total earnings',
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            borderColor: 'border-emerald-100'
        },
        {
            title: 'Total Orders',
            value: ordersCount,
            icon: ShoppingBag,
            description: 'Orders placed',
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            borderColor: 'border-blue-100'
        },
        {
            title: 'Active Users',
            value: usersCount,
            icon: Users,
            description: 'Registered accounts',
            color: 'text-violet-600',
            bg: 'bg-violet-50',
            borderColor: 'border-violet-100'
        },
        {
            title: 'Products',
            value: productsCount,
            icon: Package,
            description: 'Items in catalogue',
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            borderColor: 'border-amber-100'
        }
    ]

    return (
        <div>
            <div className="mb-8 p-6 bg-gradient-to-r from-primary/10 to-transparent rounded-2xl border border-primary/10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
                <p className="text-muted-foreground">Welcome back, Admin. Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => (
                    <div key={i} className={`p-6 rounded-2xl border ${stat.borderColor} bg-white shadow-sm hover:shadow-md transition-shadow`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            {i === 0 && <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full"><TrendingUp className="w-3 h-3 mr-1" /> +12%</span>}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                            <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/20 rounded-full translate-y-1/3 -translate-x-1/3 blur-2xl"></div>

                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-2">Quick Insight</h3>
                        <p className="text-gray-400 mb-6 max-w-md">
                            The average order value is currently <span className="text-white font-bold">₹{Math.round(avgOrderValue).toLocaleString()}</span>.
                            Consider running a promotion to boost this metric.
                        </p>
                    </div>
                </div>

                {/* Placeholder for future specific alerts or tasks */}
                <div className="bg-white border rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <TrendingUp className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900">System Status</h3>
                    <p className="text-sm text-muted-foreground">All systems operational</p>
                </div>
            </div>
        </div>
    )
}
