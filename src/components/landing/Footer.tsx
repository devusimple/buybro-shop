import Link from 'next/link';
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';

const footerLinks = {
  shop: [
    { name: 'All Products', href: '/store' },
    { name: 'New Arrivals', href: '/store?sort=newest' },
    { name: 'Best Sellers', href: '/store?featured=true' },
    { name: 'Sale', href: '/store?sale=true' },
  ],
  categories: [
    { name: 'Electronics', href: '/store?category=electronics' },
    { name: 'Fashion', href: '/store?category=fashion' },
    { name: 'Home & Living', href: '/store?category=home-living' },
    { name: 'Sports', href: '/store?category=sports' },
  ],
  support: [
    { name: 'Contact Us', href: '#contact' },
    { name: 'FAQs', href: '#faqs' },
    { name: 'Shipping Info', href: '#shipping' },
    { name: 'Returns', href: '#returns' },
  ],
  company: [
    { name: 'About Us', href: '#about' },
    { name: 'Careers', href: '#careers' },
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Terms of Service', href: '#terms' },
  ],
};

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com' },
];

const features = [
  { icon: Truck, title: 'Free Shipping', description: 'On orders over $100' },
  { icon: ShieldCheck, title: 'Secure Payment', description: '100% secure checkout' },
  { icon: HeartHandshake, title: 'Easy Returns', description: '30-day return policy' },
  { icon: CreditCard, title: 'Multiple Payment', description: 'Various payment options' },
];

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      {/* Features Bar */}
      <div className="border-b">
        <div className="container px-4 md:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{feature.title}</div>
                  <div className="text-xs text-muted-foreground">{feature.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="inline-block">
              <h2 className="text-2xl font-bold">
                <span className="text-primary">Shop</span>Hub
              </h2>
            </Link>
            <p className="text-muted-foreground mt-4 text-sm">
              Your one-stop destination for premium products. We curate the best items
              from around the world to bring you quality, style, and value.
            </p>

            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@shophub.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>123 Commerce St, NY 10001</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Links */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t">
        <div className="container px-4 md:px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} BuyBro. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <img
                src="https://www.dutchbanglabank.com/img/slides/mobile-Banking-Billboard.jpg"
                alt="DBBL ROCKET"
                className="h-6"
              />
              <img
                src="https://nagad.com.bd/_nuxt/img/new-logo.14fe8a5.png"
                alt="Nagad"
                className="h-6"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/100px-Mastercard-logo.svg.png"
                alt="Mastercard"
                className="h-6"
              />
              <img
                src="https://cdn.brandfetch.io/idxAg10C0L/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1746435914582"
                alt="Stripe"
                className="h-8"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
