'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingBag, X } from 'lucide-react'
import Link from 'next/link'

interface OrderHistoryProps {
    orders: any[]
}

const statusColors: any = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
}

export function OrderHistory({ orders }: OrderHistoryProps) {
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null)

    if (!orders || orders.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                    <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-medium text-lg mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-6">You need to treat yourself to something sweet!</p>
                <Link href="/shop">
                    <Button>Start Shopping</Button>
                </Link>
            </div>
        )
    }

    return (
        <>
            <div className="space-y-4">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="bg-white p-6 rounded-xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:border-primary/50 transition-colors group"
                        onClick={() => setSelectedOrder(order)}
                    >
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-xs text-muted-foreground">#{order.id.slice(0, 8)}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                            </div>
                            <p className="font-medium text-lg group-hover:text-primary transition-colors">
                                {order.items?.length || 0} items • ₹{order.total_price.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Ordered on {new Date(order.created_at).toLocaleDateString('en-GB')}
                            </p>
                        </div>
                        <Button variant="ghost" size="sm" className="hidden md:flex">View Details</Button>
                    </div>
                ))}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                            <div>
                                <h2 className="text-xl font-bold">Order Details</h2>
                                <p className="text-sm text-muted-foreground font-mono">#{selectedOrder.id}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(null)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status & Date */}
                            <div className="flex justify-between items-start bg-gray-50 p-4 rounded-lg">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-bold">Placed On</p>
                                    <p className="font-medium">{new Date(selectedOrder.created_at).toLocaleDateString('en-GB')}</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex justify-end gap-2 mt-1">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${selectedOrder.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {selectedOrder.payment_status}
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[selectedOrder.status] || 'bg-gray-100'}`}>
                                            {selectedOrder.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Special Instructions */}
                            {selectedOrder.delivery_address?.notes && (
                                <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg">
                                    <p className="text-xs text-yellow-700 uppercase font-bold mb-1">Your Requirements</p>
                                    <p className="text-sm text-yellow-900 italic">"{selectedOrder.delivery_address.notes}"</p>
                                </div>
                            )}

                            {/* Items List */}
                            <div>
                                <h3 className="font-bold mb-4">Items Ordered</h3>
                                <div className="space-y-3">
                                    {selectedOrder.items?.map((item: any, idx: number) => (
                                        <div key={idx} className="flex gap-4 items-center border-b pb-3 last:border-0">
                                            {item.products?.images?.[0] && (
                                                <img src={item.products.images[0]} className="w-16 h-16 rounded-md object-cover bg-gray-100" />
                                            )}
                                            <div className="flex-1">
                                                <p className="font-medium">{item.products?.name}</p>
                                                <p className="text-sm text-muted-foreground">Size: {item.product_sizes?.size_label}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold">x{item.quantity}</p>
                                                <p className="text-sm text-muted-foreground">₹{(Number(item.product_sizes?.price) * item.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t pt-4 flex justify-between items-center">
                                <span className="font-bold text-lg">Total Amount</span>
                                <span className="font-bold text-xl text-primary">₹{selectedOrder.total_price.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
