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

export default async function MenuPage() {
    const { data: products, error } = await supabase
        .from('products')
        .select(`
            *,
            product_sizes (*)
        `)
        .eq('is_available', true)
        .order('category')

    if (error) {
        console.error('Error fetching menu:', error)
    }

    const typedProducts = (products || []) as ProductWithSizes[]

    // Group by Category
    const grouped = typedProducts.reduce((acc, product) => {
        const cat = product.category
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(product)
        return acc
    }, {} as Record<string, ProductWithSizes[]>)

    const categories = Object.keys(grouped)

    return (
        <main className="min-h-screen bg-[#FAF9F6]">
            <Suspense><Header /></Suspense>

            <div className="pt-24 pb-12 container mx-auto px-4">
                <header className="mb-16 text-center">
                    <span className="text-primary font-medium tracking-wider uppercase mb-2 block">Our Full Collection</span>
                    <h1 className="text-5xl font-bold font-serif mb-6 text-foreground">The Menu</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Explore our complete selection of handcrafted delights, baked fresh daily.
                    </p>
                </header>

                {categories.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground">Loading menu...</p>
                    </div>
                ) : (
                    <div className="space-y-20">
                        {categories.map((category) => (
                            <section key={category} id={category} className="scroll-mt-24">
                                <div className="flex items-center gap-4 mb-8">
                                    <h2 className="text-3xl font-bold capitalize font-serif text-primary">{category}</h2>
                                    <div className="h-px bg-border flex-1"></div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10">
                                    {grouped[category].map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </main>
    )
}
