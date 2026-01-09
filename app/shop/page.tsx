import { Suspense } from 'react'
import { createClient } from '@/utils/supabase/server'
import { ProductCard } from '@/components/product/product-card'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ShopFilters } from '@/components/shop/shop-filters'
import { Database } from '@/types/database.types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Filter } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet"

type ProductWithSizes = Database['public']['Tables']['products']['Row'] & {
    product_sizes: Database['public']['Tables']['product_sizes']['Row'][]
}

export const dynamic = 'force-dynamic'

interface ShopPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
    const supabase = await createClient()
    const params = await searchParams
    const category = typeof params.category === 'string' ? params.category : undefined
    const search = typeof params.q === 'string' ? params.q : undefined

    // Handle tags: can be string or array of strings
    const rawTags = params.tag
    const tags = Array.isArray(rawTags) ? rawTags : rawTags ? [rawTags] : undefined

    let query = supabase
        .from('products')
        .select(`
            *,
            product_sizes (*)
        `)
        .eq('is_available', true)

    if (category) {
        query = query.eq('category', category)
    }

    if (search) {
        query = query.ilike('name', `%${search}%`)
    }

    if (tags && tags.length > 0) {
        // Filter products that contain *any* of the selected tags (OR logic)

        let searchTags = [...tags]

        // Expansion logic for "occasions" category
        const processingTags = tags.map(t => t.toLowerCase())
        if (processingTags.includes('occasions')) {
            const occasionTags = ['Birthday', 'Anniversary', 'Wedding', 'Baby Shower']
            searchTags.push(...occasionTags)
            // Remove 'occasions'
            searchTags = searchTags.filter(t => t.toLowerCase() !== 'occasions')
        }

        // Case-insensitivity support: Add lowercase and capitalized versions of all tags
        const expandedTags = new Set<string>()
        searchTags.forEach(t => {
            expandedTags.add(t) // original
            expandedTags.add(t.toLowerCase()) // lowercase
            expandedTags.add(t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()) // Capitalized
        })

        query = query.overlaps('tags', Array.from(expandedTags))
    }

    const { data: products, error } = await query

    if (error) {
        console.error('Error fetching products:', error)
    }

    const typedProducts = (products || []) as ProductWithSizes[]

    return (
        <main className="min-h-screen bg-muted/30">
            <Suspense><Header /></Suspense>

            <div className="pt-24 pb-12 container mx-auto px-4">
                <header className="mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary capitalize text-center md:text-left">
                        {search ? `Results for "${search}"` : category ? `${category} Menu` : 'Everyday Treats'}
                    </h1>
                </header>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Desktop Sidebar */}
                    <aside className="hidden md:block w-64 flex-shrink-0">
                        <div className="sticky top-24">
                            <Suspense>
                                <ShopFilters />
                            </Suspense>
                        </div>
                    </aside>

                    {/* Mobile Filter Toggle */}
                    <div className="md:hidden mb-6">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="w-full gap-2">
                                    <Filter className="w-4 h-4" /> Filters
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <div className="py-6">
                                    <SheetTitle className="text-xl font-bold mb-6">Filters</SheetTitle>
                                    <Suspense>
                                        <ShopFilters />
                                    </Suspense>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {typedProducts.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
                                <h3 className="text-xl font-medium">No treats found</h3>
                                <p className="text-muted-foreground mb-6">
                                    Try adjusting your filters or search term.
                                </p>
                                {(search || category || tags) && (
                                    <Link href="/shop" className="text-primary hover:underline font-medium">Clear All Filters</Link>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {typedProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    )
}
