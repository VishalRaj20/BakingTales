import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { ProductCard } from '@/components/product/product-card'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Database } from '@/types/database.types'
import { notFound } from 'next/navigation'

type ProductWithSizes = Database['public']['Tables']['products']['Row'] & {
    product_sizes: Database['public']['Tables']['product_sizes']['Row'][]
}

export const revalidate = 60
export const dynamicParams = true

interface CategoryPageProps {
    params: Promise<{ category: string }>
}

export async function generateStaticParams() {
    return [
        { category: 'cakes' },
        { category: 'cookies' },
        { category: 'pastries' },
        { category: 'brownies' },
    ]
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { category } = await params

    const { data: products, error } = await supabase
        .from('products')
        .select(`
            *,
            product_sizes (*)
        `)
        .eq('is_available', true)
        .eq('category', category)

    if (error) {
        console.error('Error fetching category products:', JSON.stringify(error, null, 2))
    }

    const typedProducts = (products || []) as ProductWithSizes[]

    return (
        <main className="min-h-screen bg-muted/30">
            <Suspense><Header /></Suspense>

            <div className="pt-24 pb-12 container mx-auto px-4">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-bold mb-4 text-primary capitalize">
                        {category}
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Freshly baked {category} made just for you.
                    </p>
                </header>

                {typedProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <h3 className="text-xl font-medium">No {category} found.</h3>
                        <p className="text-muted-foreground">Check back later!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {typedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </main>
    )
}
