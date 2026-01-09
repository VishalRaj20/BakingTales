'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface HeroSequenceProps {
    bucketUrl: string
    frameCount?: number
    startIndex?: number
    className?: string
}

const FRAME_URL_SUFFIX = '_delay-0.041s.webp'

// We will assume standard frame naming: frame_000, frame_001, etc.
const getFrameUrl = (baseUrl: string, frame: number): string => {
    const framePadded = String(frame).padStart(3, '0')
    return `${baseUrl}/frame_${framePadded}${FRAME_URL_SUFFIX}`
}

export function HeroSequence({
    bucketUrl,
    frameCount = 100,
    startIndex = 0,
    className
}: HeroSequenceProps) {
    const [currentFrame, setCurrentFrame] = useState(0)
    const [isReady, setIsReady] = useState(false)
    const [urls, setUrls] = useState<string[]>([])

    // Initialize URLs
    useEffect(() => {
        const generatedUrls = Array.from({ length: frameCount }, (_, i) => getFrameUrl(bucketUrl, i + startIndex))
        setUrls(generatedUrls)
    }, [bucketUrl, frameCount, startIndex])

    useEffect(() => {
        if (urls.length === 0) return

        let loadedCount = 0
        const preloadLimit = 30 // Preload first 30 frames

        // Initial preload
        const initialLoad = urls.slice(0, preloadLimit).map(url => {
            return new Promise<void>((resolve) => {
                const img = new window.Image()
                img.src = url
                img.onload = () => {
                    loadedCount++
                    if (loadedCount >= 5) setIsReady(true) // Start early
                    resolve()
                }
                img.onerror = () => resolve()
            })
        })

        Promise.all(initialLoad)

        // Lazy load the rest
        if (urls.length > preloadLimit) {
            setTimeout(() => {
                urls.slice(preloadLimit).forEach(url => {
                    const img = new window.Image()
                    img.src = url
                })
            }, 2000)
        }
    }, [urls])

    // Animation Loop
    useEffect(() => {
        if (!isReady) return

        let frameId: number
        let lastTime = 0
        const frameDuration = 41 // ~24fps

        const animate = (timestamp: number) => {
            if (!lastTime) lastTime = timestamp
            const deltaTime = timestamp - lastTime

            if (deltaTime > frameDuration) {
                lastTime = timestamp
                setCurrentFrame(prev => (prev + 1) % frameCount)
            }
            frameId = requestAnimationFrame(animate)
        }

        frameId = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(frameId)
    }, [isReady, frameCount])

    if (urls.length === 0) return null

    return (
        <div className={cn("absolute inset-0 w-full h-full", className)}>
            {/* Fallback/First Frame */}
            <Image
                src={urls[0]}
                fill
                priority
                alt="Baking Tales Hero Background"
                className={cn(
                    'object-cover w-full h-full transition-opacity duration-1000',
                    isReady ? 'opacity-0' : 'opacity-100'
                )}
            />

            {/* Active Animation Frame */}
            {isReady && (
                <Image
                    src={urls[currentFrame]}
                    fill
                    priority
                    unoptimized // Crucial for performance on rapid frame changes
                    alt="Baking Tales Animation"
                    className="object-cover w-full h-full"
                />
            )}
        </div>
    )
}
