'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Database } from '@/types/database.types'
import { useRouter } from 'next/navigation'

type WishlistItem = Database['public']['Tables']['wishlist']['Row'] & {
    products: Database['public']['Tables']['products']['Row']
}

interface WishlistContextType {
    items: WishlistItem[]
    toggleWishlist: (productId: string) => Promise<void>
    refreshWishlist: () => Promise<void>
    isInWishlist: (productId: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const supabase = createClient()
    const [items, setItems] = useState<WishlistItem[]>([])
    const router = useRouter()

    const refreshWishlist = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            setItems([])
            return
        }

        const { data, error } = await supabase
            .from('wishlist')
            .select(`
        *,
        products (*)
      `)
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })

        if (!error && data) {
            setItems(data as any as WishlistItem[])
        }
    }

    useEffect(() => {
        refreshWishlist()
    }, [])

    const isInWishlist = (productId: string) => {
        return items.some(i => i.product_id === productId)
    }

    const toggleWishlist = async (productId: string) => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            router.push('/auth/login')
            return
        }

        if (isInWishlist(productId)) {
            // Remove
            setItems(prev => prev.filter(i => i.product_id !== productId))
            await supabase.from('wishlist').delete().eq('user_id', session.user.id).eq('product_id', productId)
        } else {
            // Add (Optimistic update tricky without full product data, skipping optimistic for add or just stubbing)
            // We will just fetch after add for correctness
            await supabase.from('wishlist').insert({
                user_id: session.user.id,
                product_id: productId
            })
            refreshWishlist()
        }
    }

    return (
        <WishlistContext.Provider value={{
            items,
            toggleWishlist,
            refreshWishlist,
            isInWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    )
}

export function useWishlist() {
    const context = useContext(WishlistContext)
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider')
    }
    return context
}
