'use client'

import React from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { HeroSequence } from './hero-sequence'

export function Hero() {
    const { scrollY } = useScroll()
    const y = useTransform(scrollY, [0, 500], [0, 150])

    return (
        <div className="sticky top-0 h-[85vh] md:h-screen w-full overflow-hidden bg-background z-0">
            {/* Animated Background */}
            <motion.div
                style={{ y }}
                className="absolute inset-0 z-0"
            >
                <HeroSequence
                    bucketUrl="https://jhhomokczuigpyukhuip.supabase.co/storage/v1/object/public/landing-pages"
                    frameCount={100}
                    startIndex={9} // Adjusted to skip initial blank frames if any
                    className="opacity-100" // Keep image bright, we handle overlay separately
                />

                {/* Gradient Overlay for Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />

                <div className="absolute inset-0 flex items-end justify-start p-6 md:p-16 pb-12 md:pb-24 z-20">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="max-w-xl text-left w-full"
                    >
                        <motion.h1
                            className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-4 md:mb-6 tracking-tight drop-shadow-xl font-serif leading-[1.1]"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                        >
                            Baking Tales
                        </motion.h1>
                        <motion.p
                            className="text-lg md:text-2xl text-white/90 mb-8 font-light leading-relaxed drop-shadow-md max-w-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            Experience the art of baking. Handcrafted pastries and cakes, made with passion.
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Link href="/shop" className="w-full sm:w-auto">
                                <Button className="w-full sm:w-auto bg-white text-black hover:bg-white/90 font-medium px-8 h-12 rounded-full text-base shadow-xl transition-all hover:scale-105 border-0">
                                    Order Now
                                </Button>
                            </Link>
                            <Link href="/menu" className="w-full sm:w-auto">
                                <Button className="w-full sm:w-auto text-white border-white hover:bg-white/20 hover:text-white font-medium px-8 h-12 rounded-full text-base shadow-xl transition-all hover:scale-105 backdrop-blur-sm">
                                    View Menu
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 animate-bounce"
            >
                <div className="w-1 h-12 rounded-full bg-white/20 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-white rounded-full animate-scroll-indicator" />
                </div>
            </motion.div>
        </div>
    )
}
