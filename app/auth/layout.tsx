export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Visual Side */}
            <div className="hidden lg:block relative bg-muted">
                <div className="absolute inset-0 bg-primary/20" />
                <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
                    <div>
                        <h1 className="text-4xl font-bold mb-4 text-primary-foreground">Baking Tales</h1>
                        <p className="text-lg text-foreground/80">Experience the magic of fresh baking.</p>
                    </div>
                </div>
            </div>

            {/* Form Side */}
            <div className="flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-md space-y-8">
                    {children}
                </div>
            </div>
        </div>
    )
}
