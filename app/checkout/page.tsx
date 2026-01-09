'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCart } from '@/components/providers/cart-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'
import { Loader2, CheckCircle2 } from 'lucide-react'

function CheckoutContent() {
    const supabase = createClient()
    const router = useRouter()
    const searchParams = useSearchParams()
    const { items, total, refreshCart } = useCart()
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'canceled'>('idle')
    const [notes, setNotes] = useState('')
    const [address, setAddress] = useState({ street: '', city: '', zip: '' })

    useEffect(() => {
        // ... previous useEffect logic (fetch cart etc) ...
        const handleSuccess = async () => {
            if (searchParams.get('success')) {
                setStatus('processing')
                const { data: { session } } = await supabase.auth.getSession()

                if (session) {
                    const { data: cartItems } = await supabase
                        .from('cart')
                        .select('*, products(*), product_sizes(*)')
                        .eq('user_id', session.user.id)

                    if (cartItems && cartItems.length > 0) {
                        const totalAmount = cartItems.reduce((acc, item) => acc + (Number(item.product_sizes.price) * item.quantity), 0)

                        // Retrieve notes from local storage if we want to persist across the stripe redirect
                        // OR we passed it to metadata in stripe session? 
                        // Actually, app/api/checkout/route.ts creates the session. We need to pass notes there!
                        // But wait, the order creation happens HERE in client after success.
                        // So we need to recover the notes.
                        const storedNotes = localStorage.getItem('order_notes') || ''
                        const storedAddress = JSON.parse(localStorage.getItem('order_address') || '{}')

                        const { error: orderError } = await supabase.from('orders').insert({
                            user_id: session.user.id,
                            items: cartItems,
                            total_price: totalAmount,
                            status: 'pending',
                            payment_status: 'paid',
                            delivery_address: {
                                notes: storedNotes,
                                street: storedAddress.street,
                                city: storedAddress.city,
                                zip: storedAddress.zip
                            }
                        })

                        if (orderError) {
                            console.error('Order creation failed:', orderError)
                            alert('Order creation failed. Please contact support.')
                        } else {
                            await supabase.from('cart').delete().eq('user_id', session.user.id)
                            refreshCart()
                            localStorage.removeItem('order_notes') // Cleanup
                            setStatus('success')
                        }
                    } else {
                        setStatus('success')
                    }
                }
            } else if (searchParams.get('canceled')) {
                setStatus('canceled')
            }
        }
        if (status === 'idle') {
            handleSuccess()
        }
    }, [searchParams, refreshCart])

    const handleCheckout = async () => {
        setLoading(true)
        // Save notes to local storage so we have them after redirect back
        localStorage.setItem('order_notes', notes)
        localStorage.setItem('order_address', JSON.stringify(address))

        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            router.push('/auth/login?next=/checkout')
            return
        }

        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: session.user.id,
                    returnUrl: window.location.origin + '/checkout'
                })
            })

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}))
                throw new Error(errorData.error || 'Checkout failed')
            }

            const data = await res.json()
            if (data.url) {
                window.location.href = data.url
            } else {
                throw new Error('No checkout URL received')
            }
        } catch (e: any) {
            if (e.name === 'AbortError') return
            console.error(e)
            alert(e.message || 'Network error occurred')
            setLoading(false)
        }
    }

    if (status === 'processing') {
        // ... existing ...
        return (
            <div className="container mx-auto px-4 py-24 text-center">
                <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-4" />
                <h1 className="text-2xl font-bold">Processing your order...</h1>
            </div>
        )
    }

    if (status === 'success') {
        return (
            <div className="container mx-auto px-4 py-24 text-center max-w-lg">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
                <p className="text-muted-foreground mb-8">
                    Thank you for your order. We are preparing your fresh treats!
                </p>
                <Button onClick={() => router.push('/')}>Back to Home</Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-24 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="bg-white p-6 rounded-2xl border mb-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-4 mb-6">
                    {items.map(item => (
                        <div key={item.id} className="flex justify-between">
                            <span>{item.products.name} x {item.quantity}</span>
                            <span>₹{(Number(item.product_sizes.price) * item.quantity).toLocaleString()}</span>
                        </div>
                    ))}
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Special Instructions & Requirements</label>
                    <textarea
                        className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none min-h-[100px]"
                        placeholder="e.g. Write 'Happy Birthday' on the cake, extra napkins, allergy info..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>

                <div className="mb-6 border-t pt-6">
                    <h3 className="font-semibold mb-4">Delivery Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">Street Address</label>
                            <input
                                className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                                placeholder="House No, Street Name"
                                required
                                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">City</label>
                            <input
                                className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Hyderabad"
                                required
                                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Zip Code</label>
                            <input
                                className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                                placeholder="500001"
                                required
                                onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                    <span>Total to Pay</span>
                    <span className="text-primary">₹{total.toLocaleString()}</span>
                </div>
            </div>

            <Button onClick={handleCheckout} size="lg" className="w-full h-14 text-lg" disabled={loading || items.length === 0}>
                {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Proceed to Payment
            </Button>
        </div>
    )
}

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-muted/30">
            <Header />
            <Suspense fallback={<div className="container mx-auto py-24 text-center">Loading...</div>}>
                <CheckoutContent />
            </Suspense>
            <Footer />
        </div>
    )
}
