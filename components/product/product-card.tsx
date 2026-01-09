'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Database } from '@/types/database.types'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Heart } from 'lucide-react'
import { useWishlist } from '@/components/providers/wishlist-provider'
import { cn } from '@/lib/utils'

type Product = Database['public']['Tables']['products']['Row'] & {
    product_sizes: Database['public']['Tables']['product_sizes']['Row'][]
}

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    const { toggleWishlist, isInWishlist } = useWishlist()
    // Find min and max price for display
    const prices = product.product_sizes.map(s => Number(s.price))
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)

    const priceDisplay = prices.length > 0
        ? prices.length > 1
            ? `₹${minPrice} - ₹${maxPrice}`
            : `₹${minPrice}`
        : 'Price Unavailable'

    const mainImage = product.images?.[0] || 'https://jhhomokczuigpyukhuip.supabase.co/storage/v1/object/public/products/placeholder-cake.webp'
    const isWishlisted = isInWishlist(product.id)

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300"
        >
            <Link href={`/shop/${product.slug}`} className="block relative overflow-hidden">
                <div className="aspect-[4/5] overflow-hidden bg-gray-50 relative">
                    <img
                        src={mainImage}
                        alt={product.name}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Overlay Gradient on Hover */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(product.id);
                        }}
                        className={cn(
                            "absolute top-3 right-3 p-2.5 rounded-full transition-all duration-300 shadow-sm z-10 backdrop-blur-sm",
                            isWishlisted
                                ? "bg-red-50 text-red-500 scale-110"
                                : "bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white hover:scale-110"
                        )}
                    >
                        <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
                    </button>

                    {!product.is_available && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center z-20">
                            <span className="bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">Out of Stock</span>
                        </div>
                    )}
                </div>
            </Link>

            <div className="p-5">
                <div className="mb-3 space-y-1">
                    <p className="text-primary/80 text-[10px] uppercase font-bold tracking-widest">{product.category}</p>
                    <Link href={`/shop/${product.slug}`}>
                        <h3 className="font-bold text-lg leading-tight text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                    </Link>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground font-medium">Starting from</span>
                        <span className="font-bold text-xl text-gray-900">{priceDisplay}</span>
                    </div>

                    <Link href={`/shop/${product.slug}`}>
                        <Button size="icon" className="rounded-full w-10 h-10 shadow-lg shadow-primary/25 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                            <ShoppingCart className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}
