import { Suspense } from 'react'
import { Header } from '@/components/layout/header'
import { Hero } from '@/components/home/hero'
import { WelcomeBanner } from '@/components/home/welcome-banner'
import { Footer } from '@/components/layout/footer'
import { ProductCard } from '@/components/product/product-card'
import { FeaturesSection } from '@/components/home/features-section'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'



// Revalidate every 60 seconds (ISR)
export const revalidate = 60

export default async function Home() {
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*, product_sizes(*)')
    .eq('is_available', true)
    .eq('is_featured', true)
    .limit(4)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      <Suspense><Header /></Suspense>
      <Hero />
      <div className="relative z-10 bg-background">
        <WelcomeBanner />

        <div className="container mx-auto px-4 py-24">
          <div className="flex flex-col items-center mb-12 text-center">
            <span className="text-primary font-medium tracking-wider uppercase mb-2">Fresh from the oven</span>
            <h2 className="text-4xl font-bold font-serif mb-4">Our Signature Bakes</h2>
            <div className="w-24 h-1 bg-primary rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts?.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/shop">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full">
                View All Products <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
        <FeaturesSection />
        <Footer />
      </div>
    </main >
  )
}
