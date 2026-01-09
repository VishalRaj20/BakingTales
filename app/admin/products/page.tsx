import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ProductsTable } from '@/components/admin/products-table'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
    const supabase = await createClient()
    const { data: products } = await supabase
        .from('products')
        .select(`*, product_sizes(*)`)
        .order('created_at', { ascending: false })

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Products</h1>
                <Link href="/admin/products/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                    </Button>
                </Link>
            </div>

            <ProductsTable products={products || []} />
        </div>
    )
}
