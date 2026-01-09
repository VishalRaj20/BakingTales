'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Database } from '@/types/database.types'
import { useRouter } from 'next/navigation'

type CartItem = Database['public']['Tables']['cart']['Row'] & {
    products: Database['public']['Tables']['products']['Row']
    product_sizes: Database['public']['Tables']['product_sizes']['Row']
}

interface CartContextType {
    items: CartItem[]
    addItem: (productId: string, sizeId: string, quantity: number) => Promise<void>
    removeItem: (itemId: string) => Promise<void>
    updateQuantity: (itemId: string, quantity: number) => Promise<void>
    refreshCart: () => Promise<void>
    count: number
    total: number
    loading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const supabase = createClient()
    const [items, setItems] = useState<CartItem[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const refreshCart = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            setItems([])
            setLoading(false)
            return
        }

        const { data, error } = await supabase
            .from('cart')
            .select(`
        *,
        products (*),
        product_sizes (*)
      `)
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })

        if (!error && data) {
            setItems(data as any as CartItem[])
        }
        setLoading(false)
    }

    useEffect(() => {
        refreshCart()

        // Subscribe to cart changes
        const channel = supabase
            .channel('cart-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'cart' },
                () => {
                    refreshCart()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const addItem = async (productId: string, sizeId: string, quantity: number) => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            router.push('/auth/login')
            return
        }

        // Check if item exists in DB directly to avoid stale state issues
        const { data: existingItem, error: fetchError } = await supabase
            .from('cart')
            .select('id, quantity')
            .eq('user_id', session.user.id)
            .eq('product_id', productId)
            .eq('size_id', sizeId)
            .maybeSingle()

        if (existingItem) {
            await updateQuantity(existingItem.id, existingItem.quantity + quantity)
            return
        }

        const { error } = await supabase
            .from('cart')
            .insert({
                user_id: session.user.id,
                product_id: productId,
                size_id: sizeId,
                quantity
            })

        if (error) {
            // If we still hit a duplicate key error (race condition), try to handle it or alert friendly message
            if (error.code === '23505') {
                console.warn('Race condition detected: Item already in cart, refreshing...')
                await refreshCart()
                return
            }
            console.error('Error adding to cart:', JSON.stringify(error, null, 2))
            alert('Failed to add to cart: ' + error.message)
        } else {
            refreshCart()
        }
    }

    const removeItem = async (itemId: string) => {
        // Optimistic UI
        setItems(prev => prev.filter(i => i.id !== itemId))

        const { error } = await supabase
            .from('cart')
            .delete()
            .eq('id', itemId)

        if (error) refreshCart() // Revert on error
    }

    const updateQuantity = async (itemId: string, quantity: number) => {
        if (quantity < 1) return removeItem(itemId)

        // Optimistic UI
        setItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity } : i))

        const { error } = await supabase
            .from('cart')
            .update({ quantity })
            .eq('id', itemId)

        if (error) refreshCart()
    }

    const total = items.reduce((acc, item) => {
        return acc + (Number(item.product_sizes.price) * item.quantity)
    }, 0)

    return (
        <CartContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            refreshCart,
            count: items.reduce((acc, i) => acc + i.quantity, 0),
            total,
            loading
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
