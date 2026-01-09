'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Database } from '@/types/database.types'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Heart, Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/components/providers/cart-provider'

type Product = Database['public']['Tables']['products']['Row']
type ProductSize = Database['public']['Tables']['product_sizes']['Row']

interface ProductDetailsProps {
    product: Product
    sizes: ProductSize[]
}

export function ProductDetails({ product, sizes }: ProductDetailsProps) {
    const { addItem } = useCart()
    // Sort sizes by price
    const sortedSizes = [...sizes].sort((a, b) => Number(a.price) - Number(b.price))

    const [selectedSize, setSelectedSize] = useState<ProductSize | null>(sortedSizes[0] || null)
    const [quantity, setQuantity] = useState(1)
    const [isAdding, setIsAdding] = useState(false)

    const handleAddToCart = async () => {
        if (!selectedSize) return
        setIsAdding(true)
        await addItem(product.id, selectedSize.id, quantity)
        setIsAdding(false)
    }

    const currentPrice = selectedSize ? Number(selectedSize.price) * quantity : 0

    return (
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Images Section */}
            <div className="space-y-4">
                <motion.div
                    layoutId={`product-image-${product.id}`}
                    className="aspect-square bg-muted rounded-2xl overflow-hidden relative shadow-sm"
                >
                    <img
                        src={product.images?.[0] || 'https://jhhomokczuigpyukhuip.supabase.co/storage/v1/object/public/products/placeholder-cake.webp'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </motion.div>
                <div className="grid grid-cols-4 gap-4">
                    {product.images?.map((img, i) => (
                        <div key={i} className="aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer hover:ring-2 ring-primary transition-all">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Details Section */}
            <div className="space-y-8">
                <div>
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-primary font-medium tracking-wide uppercase text-sm"
                    >
                        {product.category}
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl lg:text-5xl font-bold mt-2 text-foreground"
                    >
                        {product.name}
                    </motion.h1>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {product.tags?.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground">{tag}</span>
                        ))}
                    </div>
                </div>

                <p className="text-muted-foreground text-lg leading-relaxed">
                    {product.description}
                </p>

                {/* Size Selector */}
                <div className="space-y-4">
                    <label className="text-sm font-semibold text-foreground/80">Select Size</label>
                    <div className="flex flex-wrap gap-3">
                        {sortedSizes.map((size) => (
                            <button
                                key={size.id}
                                onClick={() => setSelectedSize(size)}
                                className={cn(
                                    "px-6 py-3 rounded-xl border text-sm font-medium transition-all duration-200",
                                    selectedSize?.id === size.id
                                        ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                                        : "border-border hover:border-primary/50 text-foreground"
                                )}
                            >
                                {size.size_label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Price & Cart Actions */}
                <div className="pt-8 border-t border-dashed">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Total Price</p>
                            <AnimatePresence mode='wait'>
                                <motion.p
                                    key={currentPrice}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="text-4xl font-bold text-primary"
                                >
                                    ₹{currentPrice.toLocaleString()}
                                </motion.p>
                            </AnimatePresence>
                        </div>

                        <div className="flex items-center bg-muted rounded-lg p-1">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="p-3 hover:bg-background rounded-md transition-colors"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="p-3 hover:bg-background rounded-md transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            size="lg"
                            className="flex-1 h-14 text-lg rounded-xl gap-2"
                            onClick={handleAddToCart}
                            disabled={isAdding || !product.is_available}
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {isAdding ? 'Adding...' : 'Add to Cart'}
                        </Button>
                        <Button variant="outline" size="icon" className="h-14 w-14 rounded-xl border-2">
                            <Heart className="w-6 h-6 text-muted-foreground" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
