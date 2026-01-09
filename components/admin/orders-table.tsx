'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface OrdersTableProps {
    orders: any[]
}

const statusColors: any = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
}

export function OrdersTable({ orders }: OrdersTableProps) {
    const router = useRouter()
    const supabase = createClient()
    const [updatingId, setUpdatingId] = useState<string | null>(null)
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null)

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        setUpdatingId(orderId)
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId)

            if (error) throw error
            router.refresh()
        } catch (e) {
            console.error(e)
            alert('Failed to update status')
        } finally {
            setUpdatingId(null)
        }
    }

    return (
        <div className="bg-white rounded-xl border overflow-hidden overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="p-4 font-medium text-gray-600">Order ID</th>
                        <th className="p-4 font-medium text-gray-600">Date</th>
                        <th className="p-4 font-medium text-gray-600">Customer</th>
                        <th className="p-4 font-medium text-gray-600">Total</th>
                        <th className="p-4 font-medium text-gray-600">Payment</th>
                        <th className="p-4 font-medium text-gray-600">Status</th>
                        <th className="p-4 font-medium text-gray-600 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {orders.map((order) => (
                        <tr key={order.id} className="group hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedOrder(order)}>
                            <td className="p-4 font-mono text-xs text-muted-foreground">
                                {order.id.slice(0, 8)}...
                            </td>
                            <td className="p-4 text-sm" suppressHydrationWarning>
                                {new Date(order.created_at).toLocaleDateString('en-GB')}
                            </td>
                            <td className="p-4 text-sm">
                                {order.profiles?.full_name || order.profiles?.phone || 'Unknown'}
                            </td>
                            <td className="p-4 font-bold">
                                ₹{order.total_price.toLocaleString()}
                            </td>
                            <td className="p-4 text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {order.payment_status}
                                </span>
                            </td>
                            <td className="p-4 text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || 'bg-gray-100'}`}>
                                    {order.status}
                                </span>
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <Button size="sm" variant="ghost" onClick={() => setSelectedOrder(order)}>
                                        View Details
                                    </Button>

                                    {order.status === 'pending' && (
                                        <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(order.id, 'processing')} disabled={updatingId === order.id}>
                                            {updatingId === order.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Process'}
                                        </Button>
                                    )}
                                    {order.status === 'processing' && (
                                        <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(order.id, 'shipped')} disabled={updatingId === order.id}>
                                            {updatingId === order.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Ship'}
                                        </Button>
                                    )}
                                    {order.status === 'shipped' && (
                                        <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(order.id, 'delivered')} disabled={updatingId === order.id}>
                                            {updatingId === order.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Complete'}
                                        </Button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {(!orders || orders.length === 0) && (
                <div className="p-8 text-center text-muted-foreground">
                    No orders found.
                </div>
            )}

            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                            <div>
                                <h2 className="text-xl font-bold">Order Details</h2>
                                <p className="text-sm text-muted-foreground font-mono">#{selectedOrder.id}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(null)}>✕</Button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-bold">Customer</p>
                                    <p className="font-medium">{selectedOrder.profiles?.full_name || 'Guest'}</p>
                                    <p className="text-sm">{selectedOrder.profiles?.phone}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground uppercase font-bold">Order Status</p>
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

                            {selectedOrder.delivery_address?.notes && (
                                <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg">
                                    <p className="text-xs text-yellow-700 uppercase font-bold mb-1">Special Instructions</p>
                                    <p className="text-sm text-yellow-900 italic">"{selectedOrder.delivery_address.notes}"</p>
                                </div>
                            )}

                            <div>
                                <h3 className="font-bold mb-4">Items Ordered</h3>
                                <div className="space-y-3">
                                    {selectedOrder.items?.map((item: any, idx: number) => (
                                        <div key={idx} className="flex gap-4 items-center border-b pb-3 last:border-0">
                                            {item.products?.images?.[0] && (
                                                <img src={item.products.images[0]} className="w-12 h-12 rounded object-cover bg-gray-100" />
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

                            <div className="flex gap-2 justify-end pt-4">
                                {selectedOrder.status === 'pending' && <Button onClick={() => handleStatusUpdate(selectedOrder.id, 'processing')}>Mark Processing</Button>}
                                {selectedOrder.status === 'processing' && <Button onClick={() => handleStatusUpdate(selectedOrder.id, 'shipped')}>Mark Shipped</Button>}
                                {selectedOrder.status === 'shipped' && <Button onClick={() => handleStatusUpdate(selectedOrder.id, 'delivered')}>Mark Delivered</Button>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
