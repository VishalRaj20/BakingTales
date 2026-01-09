
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    full_name: string | null
                    phone: string | null
                    city: string | null
                    role: 'user' | 'admin' | 'staff'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    full_name?: string | null
                    phone?: string | null
                    city?: string | null
                    role?: 'user' | 'admin' | 'staff'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string | null
                    phone?: string | null
                    city?: string | null
                    role?: 'user' | 'admin' | 'staff'
                    created_at?: string
                    updated_at?: string
                }
            }
            products: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    description: string | null
                    category: string
                    images: string[]
                    video: string | null
                    tags: string[]
                    is_available: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    description?: string | null
                    category: string
                    images?: string[]
                    video?: string | null
                    tags?: string[]
                    is_available?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    description?: string | null
                    category?: string
                    images?: string[]
                    video?: string | null
                    tags?: string[]
                    is_available?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            product_sizes: {
                Row: {
                    id: string
                    product_id: string
                    size_label: string
                    price: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    product_id: string
                    size_label: string
                    price: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    product_id?: string
                    size_label?: string
                    price?: number
                    created_at?: string
                }
            }
            cart: {
                Row: {
                    id: string
                    user_id: string
                    product_id: string
                    size_id: string
                    quantity: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    product_id: string
                    size_id: string
                    quantity?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    product_id?: string
                    size_id?: string
                    quantity?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            wishlist: {
                Row: {
                    id: string
                    user_id: string
                    product_id: string
                    size_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    product_id: string
                    size_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    product_id?: string
                    size_id?: string | null
                    created_at?: string
                }
            }
            orders: {
                Row: {
                    id: string
                    user_id: string
                    items: Json
                    total_price: number
                    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
                    payment_status: string
                    stripe_session_id: string | null
                    delivery_address: Json | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    items: Json
                    total_price: number
                    status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
                    payment_status?: string
                    stripe_session_id?: string | null
                    delivery_address?: Json | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    items?: Json
                    total_price?: number
                    status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
                    payment_status?: string
                    stripe_session_id?: string | null
                    delivery_address?: Json | null
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}
