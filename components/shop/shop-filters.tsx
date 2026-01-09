'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

const FILTERS = [
    {
        name: 'Dietary',
        options: ['Eggless', 'Vegan', 'Gluten Free', 'Sugar Free']
    },
    {
        name: 'Occasion',
        options: ['Birthday', 'Anniversary', 'Wedding', 'Baby Shower']
    },
    {
        name: 'Flavor',
        options: ['Chocolate', 'Vanilla', 'Red Velvet', 'Fruit', 'Nut']
    }
]

export function ShopFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentTags = searchParams.getAll('tag')

    const handleTagChange = (tag: string, checked: boolean | string) => {
        const params = new URLSearchParams(searchParams.toString())

        if (checked) {
            params.append('tag', tag)
        } else {
            params.delete('tag', tag) // specific deletion needs simpler handling for URLSearchParams
            // URLSearchParams.delete(name, value) is not supported in all envs, so we rebuild
            const newTags = params.getAll('tag').filter(t => t !== tag)
            params.delete('tag')
            newTags.forEach(t => params.append('tag', t))
        }

        router.push(`/shop?${params.toString()}`)
    }

    const clearFilters = () => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete('tag')
        router.push(`/shop?${params.toString()}`)
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Filters</h3>
                {currentTags.length > 0 && (
                    <Button variant="link" onClick={clearFilters} className="h-auto p-0 text-xs text-muted-foreground">
                        Clear All
                    </Button>
                )}
            </div>

            {FILTERS.map((section) => (
                <div key={section.name} className="space-y-3">
                    <h4 className="font-medium text-sm text-foreground">{section.name}</h4>
                    <div className="space-y-2">
                        {section.options.map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                                <Checkbox
                                    id={option}
                                    checked={currentTags.some(t => t.toLowerCase() === option.toLowerCase())}
                                    onCheckedChange={(checked) => handleTagChange(option.toLowerCase(), checked as boolean)}
                                />
                                <Label htmlFor={option} className="text-sm font-normal cursor-pointer text-muted-foreground">{option}</Label>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
