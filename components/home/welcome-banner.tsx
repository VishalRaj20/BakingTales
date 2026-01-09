'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function WelcomeBanner() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user || null)
            setLoading(false)
        })
    }, [])

    if (loading || !user) return null

    const firstName = user.user_metadata?.full_name?.split(' ')[0] || 'Friend'

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="container mx-auto px-4 -mt-8 mb-12 relative z-10"
            >
                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-sm">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-primary mb-1">
                            Welcome back, {firstName}! 🧁
                        </h2>
                        <p className="text-muted-foreground">
                            Ready to order your favorites? We've got something special baking just for you.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/account">
                            <Button variant="outline">View Orders</Button>
                        </Link>
                        <Link href="/shop">
                            <Button>Browse Shop</Button>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
