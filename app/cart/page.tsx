'use client'

import React from 'react'
import Link from 'next/link'
import { useCart } from '@/components/providers/cart-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default function CartPage() {
    const { items, updateQuantity, removeItem, total, loading } = useCart()

    if (loading) {
        return (
            <div className="min-h-screen bg-muted/30">
                <Suspense><Header /></Suspense>
                <div className="container mx-auto px-4 py-24 text-center">
                    <div className="animate-pulse">Loading cart...</div>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-muted/30">
            <Suspense><Header /></Suspense>

            <div className="container mx-auto px-4 py-24">
                <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

                {items.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-border/50">
                        <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
                        <p className="text-muted-foreground mb-8">Looks like you haven&apos;t added any treats yet.</p>
                        <Link href="/shop">
                            <Button size="lg">Start Shopping</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            <AnimatePresence>
                                {items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-white p-4 rounded-xl border border-border/50 flex gap-4 items-center"
                                    >
                                        <div className="h-24 w-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.products.images?.[0]}
                                                alt={item.products.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold">{item.products.name}</h3>
                                                    <p className="text-sm text-muted-foreground">{item.product_sizes.size_label} • ₹{item.product_sizes.price}</p>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-muted-foreground hover:text-red-500 transition-colors p-2"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center bg-muted rounded-lg">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-2 hover:bg-background rounded-md transition-colors"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-2 hover:bg-background rounded-md transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <p className="font-bold text-primary">₹{(Number(item.product_sizes.price) * item.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-2xl border border-border/50 sticky top-24">
                                <h3 className="font-bold text-lg mb-4">Order Summary</h3>

                                <div className="space-y-2 mb-6 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>₹{total.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Delivery</span>
                                        <span>Calculated at checkout</span>
                                    </div>
                                </div>

                                <div className="flex justify-between font-bold text-lg mb-6 pt-4 border-t">
                                    <span>Total</span>
                                    <span className="text-primary">₹{total.toLocaleString()}</span>
                                </div>

                                <Link href="/checkout">
                                    <Button className="w-full h-12 text-lg rounded-xl" size="lg">
                                        Checkout <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    )
}
