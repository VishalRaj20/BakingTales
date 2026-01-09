import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-background border-t">
            <div className="container mx-auto px-4 py-14 grid gap-10 md:grid-cols-4 text-center md:text-left">

                {/* Brand */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-primary">Baking Tales</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Handcrafted cakes and desserts made with love, fresh ingredients,
                        and a touch of magic for every celebration.
                    </p>
                </div>

                {/* Shop */}
                <div>
                    <h4 className="font-semibold mb-4">Shop</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><Link href="/cakes" className="hover:text-primary">Cakes</Link></li>
                        <li><Link href="/cupcakes" className="hover:text-primary">Cupcakes</Link></li>
                        <li><Link href="/pastries" className="hover:text-primary">Pastries</Link></li>
                        <li><Link href="/custom-orders" className="hover:text-primary">Custom Orders</Link></li>
                    </ul>
                </div>

                {/* Company */}
                <div>
                    <h4 className="font-semibold mb-4">Company</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
                        <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
                        <li><Link href="/careers" className="hover:text-primary">Careers</Link></li>
                        <li><Link href="/privacy-policy" className="hover:text-primary">Privacy Policy</Link></li>
                    </ul>
                </div>

                {/* Contact & Social */}
                <div className="space-y-4">
                    <h4 className="font-semibold">Get in Touch</h4>

                    <div className="space-y-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2 justify-center md:justify-start">
                            <MapPin size={16} />
                            <span>Hyderabad, India</span>
                        </div>
                        <div className="flex items-center gap-2 justify-center md:justify-start">
                            <Phone size={16} />
                            <span>+91 98765 43210</span>
                        </div>
                        <div className="flex items-center gap-2 justify-center md:justify-start">
                            <Mail size={16} />
                            <span>hello@bakingtales.in</span>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-2 justify-center md:justify-start">
                        <Link href="#" aria-label="Instagram">
                            <Instagram className="w-5 h-5 text-muted-foreground hover:text-primary transition" />
                        </Link>
                        <Link href="#" aria-label="Facebook">
                            <Facebook className="w-5 h-5 text-muted-foreground hover:text-primary transition" />
                        </Link>
                        <Link href="#" aria-label="Twitter">
                            <Twitter className="w-5 h-5 text-muted-foreground hover:text-primary transition" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t py-6 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} Baking Tales India. All rights reserved.
            </div>
        </footer>
    )
}
