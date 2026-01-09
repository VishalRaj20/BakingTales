'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/utils/supabase/client'
import { ShoppingBag, LogOut, Edit2, Check, Loader2, X } from 'lucide-react'
import { SignOutButton } from '@/components/auth/sign-out-button'

interface ProfileEditorProps {
    initialProfile: any
}

export function ProfileEditor({ initialProfile }: ProfileEditorProps) {
    const router = useRouter()
    const supabase = createClient()
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        full_name: initialProfile?.full_name || '',
        phone: initialProfile?.phone || ''
    })

    const handleSave = async () => {
        setLoading(true)
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    phone: formData.phone
                })
                .eq('id', initialProfile.id)

            if (error) throw error

            setIsEditing(false)
            router.refresh()
        } catch (error) {
            console.error('Error updating profile:', error)
            alert('Failed to update profile')
        } finally {
            setLoading(false)
        }
    }

    return (
        <aside className="w-full md:w-80 flex-shrink-0">
            <div className="bg-white p-8 rounded-2xl border shadow-sm sticky top-24">

                {/* Avatar Section */}
                <div className="text-center mb-8 relative">
                    <div className="w-28 h-28 bg-gradient-to-br from-primary/20 to-orange-100 text-primary rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-5 border-4 border-white shadow-xl ring-1 ring-gray-100 relative group">
                        {formData.full_name?.[0]?.toUpperCase() || 'U'}

                        {/* Edit Trigger */}
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border hover:bg-gray-50 transition-colors"
                            >
                                <Edit2 className="w-4 h-4 text-gray-600" />
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                            <div className="space-y-2 text-left">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Full Name</label>
                                <Input
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2 text-left">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Phone</label>
                                <Input
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button size="sm" variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>
                                    <X className="w-4 h-4 mr-1" /> Cancel
                                </Button>
                                <Button size="sm" className="flex-1" onClick={handleSave} disabled={loading}>
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4 mr-1" /> Save</>}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2 className="font-bold text-xl flex items-center justify-center gap-2">
                                {initialProfile?.full_name || 'Valued Customer'}
                                {initialProfile?.role === 'admin' && (
                                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shadow-sm tracking-wide">
                                        Admin
                                    </span>
                                )}
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">{initialProfile?.phone}</p>

                            {initialProfile?.role === 'admin' && (
                                <Link href="/admin" className="inline-block mt-4 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-lg transition-colors border border-primary/20">
                                    Access Dashboard
                                </Link>
                            )}
                        </div>
                    )}
                </div>

                {/* Menu Actions */}
                <div className="space-y-3 pt-6 border-t">
                    <Link href="/account" className="w-full block">
                        <Button variant="outline" className="w-full justify-start gap-3 h-11 text-base font-normal hover:bg-gray-50 hover:text-primary hover:border-primary/30 transition-all">
                            <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                            My Orders
                        </Button>
                    </Link>

                    <SignOutButton />
                </div>
            </div>
        </aside>
    )
}
