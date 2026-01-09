
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    // It's acceptable for these to be empty during build or initial setup
    // but we should warn in development
    if (process.env.NODE_ENV === 'development') {
        console.warn('Missing Supabase environment variables')
    }
}

console.log('Supabase Config:', {
    url: supabaseUrl ? supabaseUrl.substring(0, 15) + '...' : 'undefined',
    key_exists: !!supabaseAnonKey
})

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
)
