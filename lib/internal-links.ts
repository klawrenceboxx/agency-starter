// Internal linking map. Slugs only (no content imports) so it is safe to use in client components like Footer.
// Keep slugs in sync with lib/local-seo-content.ts (service pages) and lib/blog-posts*.ts (posts).

export const FOOTER_SERVICE_LINKS: { href: string; label: string }[] = [
  { href: '/services/web-design-vaughan', label: 'Web design in Vaughan' },
  { href: '/services/web-design-markham', label: 'Web design in Markham' },
  { href: '/services/web-design-richmond-hill', label: 'Web design in Richmond Hill' },
  { href: '/services/seo-vaughan', label: 'SEO in Vaughan' },
  { href: '/services/email-marketing-automation', label: 'Email marketing automation' },
  { href: '/case-studies', label: 'Case studies' },
  { href: '/tools/missed-lead-calculator', label: 'Missed-lead cost calculator' },
  { href: '/partners', label: 'Partners' },
]

export const FOOTER_BLOG_LINKS: { href: string; label: string }[] = [
  { href: '/blog/how-much-does-a-website-cost-in-canada', label: 'What a website costs in Canada' },
  { href: '/blog/how-much-does-seo-cost-in-canada', label: 'What SEO costs in Canada' },
  { href: '/blog/how-to-choose-a-web-designer', label: 'How to choose a web designer' },
  { href: '/blog/website-conversion-checklist-small-business', label: 'Website conversion checklist' },
  { href: '/blog/email-marketing-for-small-business', label: 'Email marketing for small business' },
  { href: '/blog/abandoned-cart-emails', label: 'Abandoned cart emails' },
  { href: '/blog/wix-vs-squarespace-vs-shopify-vs-wordpress', label: 'Wix vs Squarespace vs Shopify vs WordPress' },
  { href: '/blog/how-to-get-google-reviews', label: 'How to get Google reviews' },
  { href: '/blog/klaviyo-pricing', label: 'Klaviyo pricing' },
]

// Service page slug -> blog post slugs shown as "Related reading".
export const SERVICE_TO_POSTS: Record<string, string[]> = {
  'web-design-vaughan': ['how-much-does-a-website-cost-in-canada', 'how-to-choose-a-web-designer', 'website-conversion-checklist-small-business'],
  'web-design-markham': ['how-much-does-a-website-cost-in-canada', 'how-to-choose-a-web-designer', 'wix-vs-squarespace-vs-shopify-vs-wordpress'],
  'web-design-richmond-hill': ['how-much-does-a-website-cost-in-canada', 'how-to-choose-a-web-designer', 'website-conversion-checklist-small-business'],
  'seo-vaughan': ['how-much-does-seo-cost-in-canada', 'how-to-get-google-reviews', 'website-conversion-checklist-small-business'],
  'email-marketing-automation': ['klaviyo-pricing', 'email-marketing-for-small-business', 'abandoned-cart-emails'],
}

// Blog post slug -> service page slugs shown as "Related services".
export const POST_TO_SERVICES: Record<string, string[]> = {
  'how-much-does-a-website-cost-in-canada': ['web-design-vaughan', 'web-design-markham'],
  'how-much-does-seo-cost-in-canada': ['seo-vaughan'],
  'how-to-choose-a-web-designer': ['web-design-vaughan', 'web-design-richmond-hill'],
  'website-conversion-checklist-small-business': ['web-design-vaughan', 'email-marketing-automation'],
  'email-marketing-for-small-business': ['email-marketing-automation'],
  'abandoned-cart-emails': ['email-marketing-automation'],
  'wix-vs-squarespace-vs-shopify-vs-wordpress': ['web-design-markham', 'web-design-vaughan'],
  'how-to-get-google-reviews': ['seo-vaughan'],
  'klaviyo-pricing': ['email-marketing-automation'],
  'klaviyo-vs-mailchimp': ['email-marketing-automation'],
  'klaviyo-vs-omnisend': ['email-marketing-automation'],
}
