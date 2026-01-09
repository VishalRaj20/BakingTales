'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/utils/supabase/client'
import { Loader2, User, Phone, Lock } from 'lucide-react'

export default function SignupPage() {
    const supabase = createClient()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const fullName = formData.get('fullName') as string
        const rawPhone = formData.get('phone') as string
        const password = formData.get('password') as string

        const phone = rawPhone.replace(/\D/g, '')

        if (phone.length < 10) {
            setError('Please enter a valid 10-digit phone number')
            setLoading(false)
            return
        }

        const email = `${phone}@bakingtales.com`

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    phone: rawPhone
                }
            }
        })

        if (error) {
            let msg = error.message
            if (msg.includes('already registered') || msg.includes('unique constraint')) {
                msg = 'This phone number is already registered'
            }
            setError(msg)
            setLoading(false)
        } else {
            router.push('/')
            router.refresh()
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[#FAF9F6] overflow-hidden px-4">
            {/* Floating background accents */}
            <motion.div
                animate={{ y: [0, 25, 0] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute -top-24 -left-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
            />
            <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300/10 rounded-full blur-3xl"
            />

            {/* Signup Card */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md bg-white rounded-3xl p-10 shadow-lg border"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-7 h-7" />
                    </div>
                    <h1 className="text-3xl font-bold">Create Your Account</h1>
                    <p className="text-muted-foreground mt-1">
                        Join Baking Tales and start celebrating
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <motion.div whileFocus={{ scale: 1.02 }}>
                        <label className="text-sm font-medium">Full Name</label>
                        <div className="relative mt-1">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                name="fullName"
                                placeholder="John Doe"
                                disabled={loading}
                                className="pl-9"
                                required
                            />
                        </div>
                    </motion.div>

                    <motion.div whileFocus={{ scale: 1.02 }}>
                        <label className="text-sm font-medium">Phone Number</label>
                        <div className="relative mt-1">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                name="phone"
                                type="tel"
                                placeholder="9876543210"
                                disabled={loading}
                                className="pl-9"
                                required
                            />
                        </div>
                    </motion.div>

                    <motion.div whileFocus={{ scale: 1.02 }}>
                        <label className="text-sm font-medium">Password</label>
                        <div className="relative mt-1">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                name="password"
                                type="password"
                                disabled={loading}
                                className="pl-9"
                                required
                            />
                        </div>
                    </motion.div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-red-500 font-medium"
                        >
                            {error}
                        </motion.p>
                    )}

                    <Button
                        type="submit"
                        size="lg"
                        disabled={loading}
                        className="w-full rounded-full"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign Up
                    </Button>
                </form>

                {/* Footer */}
                <p className="mt-8 text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link
                        href="/auth/login"
                        className="font-medium underline underline-offset-4 hover:text-primary"
                    >
                        Sign in
                    </Link>
                </p>

                {/* Trust */}
                <p className="mt-4 text-center text-xs text-muted-foreground">
                    🔒 We respect your privacy and never spam
                </p>
            </motion.div>
        </div>
    )
}
