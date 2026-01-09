import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'
import { ShoppingBag } from 'lucide-react'
import { SignOutButton } from '@/components/auth/sign-out-button'
import { OrderHistory } from '@/components/account/order-history'
import { ProfileEditor } from '@/components/account/profile-editor'

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="min-h-screen bg-muted/30">
            <Header />

            <div className="container mx-auto px-4 py-24">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar / Profile Info */}
                    <ProfileEditor initialProfile={profile} />

                    {/* Main Content: Orders */}
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold mb-6">Order History</h1>
                        <OrderHistory orders={orders || []} />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
