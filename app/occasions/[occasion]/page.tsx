import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { ProductCard } from '@/components/product/product-card'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Database } from '@/types/database.types'

type ProductWithSizes = Database['public']['Tables']['products']['Row'] & {
    product_sizes: Database['public']['Tables']['product_sizes']['Row'][]
}

export const revalidate = 60

interface OccasionPageProps {
    params: Promise<{ occasion: string }>
}

export async function generateStaticParams() {
    return [
        { occasion: 'birthday' },
        { occasion: 'anniversary' },
    ]
}

export default async function OccasionPage({ params }: OccasionPageProps) {
    const { occasion } = await params

    // Search in tags array
    // Note: Supabase/Postgres array query syntax
    const { data: products, error } = await supabase
        .from('products')
        .select(`
            *,
            product_sizes (*)
        `)
        .eq('is_available', true)
        .contains('tags', [occasion.toLowerCase()])
    // Assumes tags are stored as lowercase strings

    const typedProducts = (products || []) as ProductWithSizes[]

    return (
        <main className="min-h-screen bg-muted/30">
            <Suspense><Header /></Suspense>

            <div className="pt-24 pb-12 container mx-auto px-4">
                <header className="mb-12 text-center">
                    <span className="text-secondary-foreground font-medium tracking-wider uppercase mb-2">Celebrate with us</span>
                    <h1 className="text-4xl font-bold mb-4 text-primary capitalize">
                        {occasion} Specials
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Make your {occasion} unforgettable with our signature treats.
                    </p>
                </header>

                {typedProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <h3 className="text-xl font-medium">No treats found for {occasion} yet.</h3>
                        <p className="text-muted-foreground">But our custom cakes are always an option!</p>
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
