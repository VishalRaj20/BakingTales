'use client'

import { motion } from 'framer-motion'
import { Sparkles, Clock, ShieldCheck, Truck } from 'lucide-react'

const features = [
    {
        icon: Sparkles,
        title: 'Handpicked Ingredients',
        description:
            'From rich Belgian cocoa to farm-fresh cream, we use only premium, ethically sourced ingredients.'
    },
    {
        icon: Clock,
        title: 'Baked Fresh Daily',
        description:
            'No preservatives. No shortcuts. Every cake is baked fresh on the day of delivery.'
    },
    {
        icon: Truck,
        title: 'Same-Day Delivery',
        description:
            'Order before 2 PM and enjoy doorstep delivery by evening in select locations.'
    },
    {
        icon: ShieldCheck,
        title: 'Hygiene Guaranteed',
        description:
            'Prepared in FSSAI-certified kitchens following the highest safety standards.'
    }
]

export function FeaturesSection() {
    return (
        <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative py-28 bg-secondary/30 overflow-hidden"
        >
            {/* Floating background accents */}
            <motion.div
                animate={{ y: [0, 30, 0] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute -top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
            />
            <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300/10 rounded-full blur-3xl"
            />

            <div className="container mx-auto px-4 relative z-10">
                {/* Heading */}
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                        Why Choose <span className="text-primary">Baking Tales</span>?
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Because every celebration deserves more than a cake —
                        it deserves a memory.
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.12, duration: 0.6 }}
                            whileHover={{ y: -10 }}
                            className="group relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all"
                        >
                            {/* Gradient glow */}
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-200/20 to-orange-200/20 opacity-0 group-hover:opacity-100 transition pointer-events-none" />

                            {/* Icon */}
                            <div className="relative z-10 w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6
                              group-hover:bg-primary group-hover:text-white transition-colors">
                                <feature.icon className="w-7 h-7" />
                            </div>

                            {/* Content */}
                            <h3 className="relative z-10 text-xl font-bold mb-3">
                                {feature.title}
                            </h3>
                            <p className="relative z-10 text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Trust Strip */}
                <div className="mt-20 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
                    <span>⭐ 4.9/5 Rated by 2,000+ Customers</span>
                    <span>🎂 10,000+ Cakes Delivered</span>
                    <span>🏆 FSSAI Certified Kitchen</span>
                </div>
            </div>
        </motion.section>
    )
}
