'use client'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { Heart, Users, Coffee } from 'lucide-react'

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#FAF9F6]">
            <Suspense>
                <Header />
            </Suspense>

            {/* Hero */}
            <section className="pt-36 pb-24 text-center container mx-auto px-4">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-6xl font-serif font-bold mb-6"
                >
                    Our Story
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground text-xl max-w-2xl mx-auto"
                >
                    From a humble home kitchen to becoming a part of your celebrations —
                    this is the journey of Baking Tales.
                </motion.p>

                <div className="mt-10 w-24 h-1 bg-primary mx-auto rounded-full" />
            </section>

            {/* Story Section */}
            <section className="container mx-auto px-4 pb-28 space-y-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
                    {/* Image Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative h-[420px] rounded-3xl overflow-hidden shadow-lg bg-primary/10 flex items-center justify-center"
                    >
                        <span className="text-primary font-medium">
                            Kitchen & Baking Story Image
                        </span>
                    </motion.div>

                    {/* Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl font-serif font-bold">
                            Baked with Love, Served with Joy
                        </h2>

                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Baking Tales began with handwritten recipes, weekend experiments,
                            and a simple dream — to create desserts that feel personal.
                            Inspired by family traditions and timeless techniques,
                            we believe cakes should be as meaningful as the moments they celebrate.
                        </p>

                        <p className="text-muted-foreground text-lg leading-relaxed">
                            No shortcuts. No compromises. Just honest ingredients, patient
                            baking, and attention to every detail that reaches your table.
                        </p>
                    </motion.div>
                </div>

                {/* Values */}
                <section>
                    <h2 className="text-3xl font-serif font-bold text-center mb-16">
                        What We Stand For
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <ValueCard
                            icon={Heart}
                            title="Passion First"
                            desc="Every recipe is crafted with heart. Baking is not our job — it’s our calling."
                        />
                        <ValueCard
                            icon={Users}
                            title="Community Driven"
                            desc="From birthdays to weddings, we are honored to be part of your milestones."
                        />
                        <ValueCard
                            icon={Coffee}
                            title="Uncompromising Quality"
                            desc="We work with trusted local farmers and premium global brands."
                        />
                    </div>
                </section>
            </section>

            <Footer />
        </main>
    )
}

function ValueCard({ icon: Icon, title, desc }: any) {
    return (
        <motion.div
            whileHover={{ y: -8 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="group bg-white p-10 rounded-3xl border text-center shadow-sm hover:shadow-xl transition"
        >
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6
                      group-hover:bg-primary group-hover:text-white transition-colors">
                <Icon className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{desc}</p>
        </motion.div>
    )
}
