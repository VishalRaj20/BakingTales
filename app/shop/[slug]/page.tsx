import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ProductDetails } from '@/components/product/product-details'

interface PageProps {
    params: Promise<{ slug: string }>
}

// Revalidate every 60 seconds
export const revalidate = 60

export default async function ProductPage({ params }: PageProps) {
    const { slug } = await params

    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error || !product) {
        notFound()
    }

    const { data: sizes } = await supabase
        .from('product_sizes')
        .select('*')
        .eq('product_id', product.id)

    return (
        <main className="min-h-screen bg-background">
            <Header />

            <div className="pt-24 pb-20 container mx-auto px-4">
                <ProductDetails product={product} sizes={sizes || []} />
            </div>

            <Footer />
        </main>
    )
}
