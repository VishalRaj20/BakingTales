'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Plus, Trash2, X } from 'lucide-react'

const productSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    category: z.string().min(1, 'Category is required'),
    is_available: z.boolean().default(true),
    tags_input: z.string().optional(),
    sizes: z.array(z.object({
        size_label: z.string().min(1),
        price: z.number().min(0)
    })).min(1, 'At least one size is required')
})

type ProductFormValues = z.infer<typeof productSchema>

interface ProductFormProps {
    initialData?: any
}

export function ProductForm({ initialData }: ProductFormProps) {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [imageUrls, setImageUrls] = useState<string[]>(initialData?.images || [])

    const { register, control, handleSubmit, formState: { errors } } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: initialData ? {
            name: initialData.name,
            description: initialData.description || '',
            category: initialData.category,
            is_available: initialData.is_available,
            tags_input: initialData.tags ? initialData.tags.join(', ') : '',
            sizes: initialData.product_sizes?.map((s: any) => ({ size_label: s.size_label, price: Number(s.price) })) || [{ size_label: '1 kg', price: 0 }]
        } : {
            is_available: true,
            tags_input: '',
            sizes: [{ size_label: '1 kg', price: 0 }]
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "sizes"
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return
        setUploading(true)

        const file = e.target.files[0]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `products/${fileName}`

        try {
            const { error: uploadError } = await supabase.storage
                .from('products') // ensure bucket exists
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filePath)

            setImageUrls([...imageUrls, publicUrl])
        } catch (error) {
            console.error('Error uploading image', error)
            alert('Error uploading image')
        } finally {
            setUploading(false)
        }
    }

    const onSubmit = async (data: ProductFormValues) => {
        setLoading(true)
        try {
            // 1. Insert/Update Product
            const tags = data.tags_input
                ? data.tags_input.split(',').map(t => t.trim()).filter(Boolean)
                : []

            const productData = {
                name: data.name,
                description: data.description,
                category: data.category,
                images: imageUrls,
                is_available: data.is_available,
                tags: tags,
                slug: data.name.toLowerCase().replace(/ /g, '-') + '-' + Math.floor(Math.random() * 1000) // Simple slug gen
            }

            let productId = initialData?.id

            if (initialData) {
                // Update
                delete (productData as any).slug // don't change slug on edit usually
                const { error } = await supabase.from('products').update(productData).eq('id', productId)
                if (error) throw error
            } else {
                // Insert
                const { data: newProd, error } = await supabase.from('products').insert(productData).select().single()
                if (error) throw error
                productId = newProd.id
            }

            // 2. Insert/Update Sizes (Simpler to delete all and insert new for this MVP)
            // If updating, delete existing first
            if (initialData) {
                await supabase.from('product_sizes').delete().eq('product_id', productId)
            }

            const sizesData = data.sizes.map(s => ({
                product_id: productId,
                size_label: s.size_label,
                price: s.price
            }))

            const { error: sizeError } = await supabase.from('product_sizes').insert(sizesData)
            if (sizeError) throw sizeError

            router.push('/admin/products')
            router.refresh()
        } catch (error) {
            console.error(error)
            alert('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl bg-white p-6 rounded-xl border">
            <div className="space-y-4">
                <h2 className="text-xl font-bold">{initialData ? 'Edit Product' : 'Create Product'}</h2>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input {...register('name')} placeholder="Chocolate Cake" />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <select {...register('category')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <option value="cakes">Cakes</option>
                            <option value="pastries">Pastries</option>
                            <option value="cupcakes">Cupcakes</option>
                            <option value="occasions">Occasions</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                        {...register('description')}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Delicious chocolate cake..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Tags (comma separated)</label>
                    <Input
                        {...register('tags_input')}
                        placeholder="Birthday, Eggless, Chocolate"
                    />
                    <p className="text-xs text-muted-foreground">Used for filtering (e.g. Occasions, Dietary)</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Images</label>
                    <div className="flex flex-wrap gap-4">
                        {imageUrls.map((url, i) => (
                            <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border">
                                <img src={url} className="w-full h-full object-cover" />
                                <button type="button" onClick={() => setImageUrls(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                            {uploading ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /> : <Plus className="w-6 h-6 text-muted-foreground" />}
                            <span className="text-xs text-muted-foreground mt-2">Upload</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                        </label>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Pricing & Sizes</label>
                        <Button type="button" size="sm" variant="outline" onClick={() => append({ size_label: '', price: 0 })}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Size
                        </Button>
                    </div>

                    {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-4 items-end">
                            <div className="flex-1 space-y-2">
                                <label className="text-xs text-muted-foreground">Size Label</label>
                                <Input {...register(`sizes.${index}.size_label`)} placeholder="1 kg" />
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-xs text-muted-foreground">Price (₹)</label>
                                <Input {...register(`sizes.${index}.price`, { valueAsNumber: true })} type="number" placeholder="500" />
                            </div>
                            <Button type="button" size="icon" variant="ghost" onClick={() => remove(index)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                    {errors.sizes && <p className="text-red-500 text-sm">{errors.sizes.message}</p>}
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {initialData ? 'Update Product' : 'Create Product'}
                </Button>
            </div>
        </form >
    )
}
