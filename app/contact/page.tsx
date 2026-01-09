'use client'

import emailjs from '@emailjs/browser'
import { useRef, useState, Suspense } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { motion } from 'framer-motion'

export default function ContactPage() {
    const form = useRef<HTMLFormElement>(null)
    const [loading, setLoading] = useState(false)

    const sendEmail = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Replace these with your actual Service ID, Template ID, and Public Key
        // or use environment variables: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID, etc.
        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID'
        const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID'
        const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY'

        if (serviceId === 'YOUR_SERVICE_ID') {
            alert('Please configure EmailJS keys in .env.local')
            setLoading(false)
            return
        }

        if (!form.current) return

        emailjs.sendForm(serviceId, templateId, form.current, publicKey)
            .then((result) => {
                console.log(result.text)
                alert('Message sent successfully!')
                form.current?.reset()
            }, (error) => {
                console.log(error.text)
                alert('Failed to send message. Please try again.')
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <main className="min-h-screen bg-[#FAF9F6]">
            <Suspense>
                <Header />
            </Suspense>

            {/* Hero */}
            <section className="pt-36 pb-20 text-center px-4">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-6xl font-serif font-bold mb-4"
                >
                    Let’s Talk
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground text-lg max-w-xl mx-auto"
                >
                    Questions, custom orders, or collaboration ideas —
                    we’d love to hear from you.
                </motion.p>

                <div className="mt-8 w-24 h-1 bg-primary mx-auto rounded-full" />
            </section>

            {/* Content */}
            <section className="container mx-auto px-4 pb-28">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 max-w-6xl mx-auto">
                    {/* Info */}
                    <div className="space-y-8">
                        <InfoCard
                            icon={Mail}
                            title="Email Us"
                            content="vishalraj857808@gmail.com"
                            sub="For inquiries, orders, and feedback."
                        />
                        <InfoCard
                            icon={Phone}
                            title="Call Us"
                            content="+91 9142528179"
                            sub="For urgent matters or same-day orders."
                        />
                        <InfoCard
                            icon={MapPin}
                            title="Our Kitchen"
                            content="India"
                            sub="Online-first bakery, delivering happiness nationwide."
                        />
                    </div>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-10 rounded-3xl border shadow-sm"
                    >
                        <h2 className="text-2xl font-bold mb-2">Send Us a Message</h2>
                        <p className="text-sm text-muted-foreground mb-8">
                            We usually respond within 24 hours.
                        </p>

                        <form ref={form} onSubmit={sendEmail} className="space-y-6">
                            <InputBlock label="Your Name" name="user_name" placeholder="John Doe" required />
                            <InputBlock label="Your Email" name="user_email" type="email" placeholder="john@example.com" required />

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Your Message</label>
                                <Textarea
                                    name="message"
                                    placeholder="Tell us about your cake idea..."
                                    className="min-h-[150px] bg-muted/30"
                                    required
                                />
                            </div>

                            <Button size="lg" className="w-full" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Message'} <Send className="ml-2 w-4 h-4" />
                            </Button>
                        </form>
                    </motion.div>
                </div>

                {/* Trust note */}
                <div className="mt-16 text-center text-sm text-muted-foreground">
                    🔒 Your information is safe with Baking Tales India. We never share your details.
                </div>
            </section>

            <Footer />
        </main>
    )
}

/* ---------------------------- Components ---------------------------- */

function InfoCard({ icon: Icon, title, content, sub }: any) {
    return (
        <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="group bg-white p-8 rounded-3xl border shadow-sm hover:shadow-xl transition"
        >
            <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center
                        group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
            </div>

            <p className="text-muted-foreground text-sm mb-1">{sub}</p>
            <p className="text-lg font-semibold">{content}</p>
        </motion.div>
    )
}

function InputBlock({ label, ...props }: any) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">{label}</label>
            <Input {...props} className="bg-muted/30" />
        </div>
    )
}
