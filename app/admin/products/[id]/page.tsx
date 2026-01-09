import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ProductForm } from "@/components/admin/product-form";

interface PageProps {
    params: Promise<{ id: string }>
}

export const dynamic = 'force-dynamic'

export default async function EditProductPage({ params }: PageProps) {
    const { id } = await params

    const { data: product, error } = await supabase
        .from('products')
        .select(`
        *,
        product_sizes (*)
    `)
        .eq('id', id)
        .single()

    if (error || !product) {
        notFound()
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
            <ProductForm initialData={product} />
        </div>
    )
}
