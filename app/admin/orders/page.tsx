import { createClient } from '@/utils/supabase/server'
import { OrdersTable } from "@/components/admin/orders-table"

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return <div>Please log in</div>
    }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    console.log('[AdminDebug] User:', user.id, 'Role:', profile?.role)

    const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

    if (ordersError) {
        console.error('[AdminDebug] Fetch Error:', ordersError)
        return <div>Error loading orders</div>
    }

    console.log('[AdminDebug] Orders Found:', ordersData?.length)

    // 2. Fetch Profiles manual join
    const userIds = Array.from(new Set(ordersData?.map(o => o.user_id) || []))
    const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, phone')
        .in('id', userIds)

    // 3. Attach profile to order
    const orders = ordersData?.map(order => ({
        ...order,
        profiles: profiles?.find(p => p.id === order.user_id) || null
    })) || []

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Order Management</h1>
            <OrdersTable orders={orders || []} />
        </div>
    )
}
