import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { returnUrl } = body // We don't need userId from body anymore, we trust the token

        const userId = user.id

        // 1. Fetch Cart Items from DB for this user

        // 1. Fetch Cart Items from DB for this user
        const { data: cartItems, error } = await supabase
            .from('cart')
            .select(`
        *,
        products (name, images),
        product_sizes (price, size_label)
      `)
            .eq('user_id', userId)

        if (error || !cartItems || cartItems.length === 0) {
            return NextResponse.json({ error: 'Cart is empty or could not be fetched' }, { status: 400 })
        }

        // 2. Construct Line Items (Fetching FRESH PRICE from DB ideally, here we trust the join we just did which is from server DB)
        const line_items = cartItems.map((item: any) => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: `${item.products.name} (${item.product_sizes.size_label})`,
                    images: item.products.images ? [item.products.images[0]] : [],
                },
                unit_amount: Math.round(Number(item.product_sizes.price) * 100), // Stripe expects paise
            },
            quantity: item.quantity,
        }))

        // 3. Create Stripe Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${returnUrl}?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${returnUrl}?canceled=true`,
            metadata: {
                userId: userId,
            },
        })

        return NextResponse.json({ url: session.url })
    } catch (error: any) {
        console.error('Stripe Checkout Error Full:', JSON.stringify(error, null, 2))
        return NextResponse.json({
            error: error.message || 'Unknown error',
            details: error
        }, { status: 500 })
    }
}
