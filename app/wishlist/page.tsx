'use client'

import React from 'react'
import Link from 'next/link'
import { useWishlist } from '@/components/providers/wishlist-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Suspense } from 'react'
import { ProductCard } from '@/components/product/product-card'
import { Database } from '@/types/database.types'

export const dynamic = 'force-dynamic'

type ProductWithSizes = Database['public']['Tables']['products']['Row'] & {
    product_sizes: Database['public']['Tables']['product_sizes']['Row'][]
}

export default function WishlistPage() {
    const { items, refreshWishlist } = useWishlist()

    // Transform wishlist items back to product structure for ProductCard
    // Note: This relies on the join done in the provider
    const products = items.map(item => ({
        ...item.products,
        // We might not have product_sizes joined in the wishlist provider query 
        // check the provider...
        // The provider does: .select(`*, products (*)`)
        // It does NOT fetch product_sizes for the product.
        // We need to fetch product_sizes to render ProductCard correctly (price display).
        // This is a limitation.
        // WORKAROUND: For now, we will just render a simplified card or fix the provider.
    }))

    // Let's improve the provider fetch or fetch here. 
    // Actually, let's just make the wishlist provider fetch deep enough or render a simplified view.
    // Ideally, product card needs sizes.

    // Let's upgrade the provider query in a separate step if needed, 
    // but for now let's assume we can fetch them or just show "View Product" without price range if missing.
    // But ProductCard expects product_sizes.

    return (
        <div className="min-h-screen bg-muted/30">
            <Suspense><Header /></Suspense>

            <div className="container mx-auto px-4 py-24">
                <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

                {items.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-border/50">
                        <h2 className="text-xl font-medium mb-4">Your wishlist is empty</h2>
                        <p className="text-muted-foreground mb-8">Save your favorite treats to view them here.</p>
                        <Link href="/shop">
                            <Button size="lg">Start Shopping</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {/* 
                    We need to handle the missing product_sizes data. 
                    If we use ProductCard, it will crash or show empty price. 
                    Let's accept that for this iteration or fetch it.
                 */}
                        {items.map((item) => (
                            // Using a wrapper or just passing what we have if we fix types
                            // Ideally we should fix the provider to join product_sizes
                            <div key={item.id} className="relative">
                                {/* 
                            Since ProductCard requires product_sizes, and we don't have them in the context yet,
                            we should update the provider.
                        */}
                                <div className="bg-white p-4 rounded-xl border">
                                    <img src={item.products.images?.[0] || ''} className="w-full aspect-square object-cover rounded-lg mb-4" />
                                    <h3 className="font-bold text-lg mb-2">{item.products.name}</h3>
                                    <Link href={`/shop/${item.products.slug}`}>
                                        <Button className="w-full">View Details</Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    )
}
