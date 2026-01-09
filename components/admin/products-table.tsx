'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Edit2, Star, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ProductsTableProps {
    products: any[]
}

export function ProductsTable({ products }: ProductsTableProps) {
    const router = useRouter()
    const supabase = createClient()
    const [togglingId, setTogglingId] = useState<string | null>(null)

    const toggleFeatured = async (productId: string, currentStatus: boolean) => {
        setTogglingId(productId)
        try {
            const { error } = await supabase
                .from('products')
                .update({ is_featured: !currentStatus })
                .eq('id', productId)

            if (error) throw error
            router.refresh()
        } catch (e) {
            console.error(e)
            alert('Failed to update status')
        } finally {
            setTogglingId(null)
        }
    }

    return (
        <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-medium text-gray-600">Product</th>
                            <th className="p-4 font-medium text-gray-600">Category</th>
                            <th className="p-4 font-medium text-gray-600">Status</th>
                            <th className="p-4 font-medium text-gray-600 text-center">Featured</th>
                            <th className="p-4 font-medium text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-4 flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border">
                                        {product.images?.[0] && <img src={product.images[0]} className="w-full h-full object-cover" />}
                                    </div>
                                    <span className="font-semibold text-gray-900">{product.name}</span>
                                </td>
                                <td className="p-4 capitalize text-gray-600">{product.category}</td>
                                <td className="p-4">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${product.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {product.is_available ? 'Active' : 'Draft'}
                                    </span>
                                </td>
                                <td className="p-4 text-center">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        disabled={togglingId === product.id}
                                        onClick={() => toggleFeatured(product.id, product.is_featured)}
                                        className={`${product.is_featured ? 'text-amber-400 hover:text-amber-500' : 'text-gray-300 hover:text-gray-400'}`}
                                    >
                                        {togglingId === product.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Star className={`w-5 h-5 ${product.is_featured ? 'fill-current' : ''}`} />
                                        )}
                                    </Button>
                                </td>
                                <td className="p-4 text-right">
                                    <Link href={`/admin/products/${product.id}`}>
                                        <Button variant="ghost" size="icon">
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                    No products found. Add your first one!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
