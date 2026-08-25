// Every piece of shop-identity info lives here, sourced from env vars, so
// nothing about "which shop this is" is hardcoded into components/pages.
// Update .env.local (see .env.local.example) — never edit values here directly
// in a way that reintroduces hardcoding.

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SHOP_NAME || "Your Jewellery Shop Name",
  tagline: process.env.NEXT_PUBLIC_SHOP_TAGLINE || "Timeless Elegance, Crafted for You",
  city: process.env.NEXT_PUBLIC_SHOP_CITY || "Your City",
  state: process.env.NEXT_PUBLIC_SHOP_STATE || "Your State",
  address: process.env.NEXT_PUBLIC_SHOP_ADDRESS || "Store address not configured",
  phone: process.env.NEXT_PUBLIC_SHOP_PHONE || "+91XXXXXXXXXX",
  whatsapp: process.env.NEXT_PUBLIC_SHOP_WHATSAPP || "91XXXXXXXXXX",
  email: process.env.NEXT_PUBLIC_SHOP_EMAIL || "hello@example.com",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
} as const;

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${siteConfig.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function telLink() {
  return `tel:${siteConfig.phone}`;
}
