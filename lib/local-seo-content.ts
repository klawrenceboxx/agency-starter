// Local SEO content: service pages (/services/<slug>). Blog posts live in lib/blog-posts.ts.
// Keyword targets are validated with Semrush (Canada database, Oct 2026). See notes per entry.
// Copy rules (BUSINESS.md): plain language, one CTA ("Get Your Free Audit"), no invented stats or testimonials.

export type Section = { h: string; p?: string[]; items?: string[] }
export type Faq = { q: string; a: string }

export type LocalPage = {
  slug: string
  metaTitle: string
  metaDescription: string
  eyebrow: string
  h1: string
  lead: string
  sections: Section[]
  faq: Faq[]
  related: string[]
}

export const LOCAL_PAGES: LocalPage[] = [
  {
    // target: "web design vaughan" (320/mo, KD 12) + "website design vaughan" (170/mo, KD 7)
    slug: 'web-design-vaughan',
    metaTitle: 'Web Design Vaughan | Websites That Turn Visitors Into Customers',
    metaDescription:
      'Web design in Vaughan built to turn more visitors into customers. Fast, mobile-first sites with a 30-day money-back guarantee. Get a free audit.',
    eyebrow: 'Web design in Vaughan',
    h1: 'Web design in Vaughan that turns visitors into customers.',
    lead:
      'Most websites look fine and still lose leads. I build websites for Vaughan businesses around one goal: getting more of your visitors to call, book, or buy.',
    sections: [
      {
        h: 'What you get',
        items: [
          'A clear message in the first few seconds',
          'Buttons and forms where people are ready to act',
          'A fast site that is easy to use on a phone',
          'Search basics built in, so local customers can find you',
          'Built on Next.js or Shopify, depending on what you sell',
        ],
      },
      {
        h: 'How it works',
        items: [
          'Free audit. I look at your site and show you where it loses people.',
          'Plan. You get a clear quote on a short call before any work starts.',
          'Build. I plan the site around one goal, then design and build it.',
          'Launch. If you are not happy within 30 days of launch, you choose: a full refund, or I keep working at no extra cost until you are.',
        ],
      },
      {
        h: 'Who this is for',
        p: [
          'Service businesses and online stores in Vaughan, Woodbridge, Maple, Concord and Kleinburg. It fits you best if you already get leads from ads, social media, or networking, and want more of them to turn into customers.',
        ],
      },
      {
        h: 'Recent work',
        items: [
          'CamAutoPro: a Shopify store with conversion work, search fixes, and automated email flows.',
          'PosterGenius: my own Next.js store, built with the same approach.',
        ],
      },
    ],
    faq: [
      {
        q: 'How much does a website cost?',
        a: 'It depends on what needs fixing. You get a clear quote on a short call before any work starts. The audit is free.',
      },
      {
        q: 'Do you build online stores?',
        a: 'Yes. I build on Shopify and on custom Next.js.',
      },
      {
        q: 'Can you fix my current site instead of rebuilding it?',
        a: 'Often, yes. The audit shows which one makes sense for you.',
      },
    ],
    related: ['seo-vaughan', 'email-marketing-automation', 'web-design-markham'],
  },
  {
    // target: "seo vaughan" (590/mo, KD 19), "seo services vaughan" (260/mo, KD 20),
    // "seo company vaughan" (260/mo, KD 14), "local seo vaughan" (70/mo, KD 11)
    slug: 'seo-vaughan',
    metaTitle: 'SEO Services Vaughan | Local SEO That Brings You Leads',
    metaDescription:
      'SEO for Vaughan businesses. Search fixes, local search setup, and a site built to turn the visits you get into leads. Start with a free audit.',
    eyebrow: 'SEO in Vaughan',
    h1: 'SEO in Vaughan, so the right people can find you.',
    lead:
      'Ranking is only half of the job. I fix the search basics so Vaughan customers can find you, then make sure your site turns those visits into leads.',
    sections: [
      {
        h: 'What is included',
        items: [
          'A technical check: speed, indexing, and site structure',
          'One clear page for each service you sell',
          'Local search: your Google Business Profile, listings, and reviews',
          'Page titles and descriptions written for the person searching',
          'Fixes to the page itself, so new visits do not leak away',
        ],
      },
      {
        h: 'Why local search matters',
        p: [
          'When someone searches for a service with a city name in it, they are usually ready to hire. Showing up for searches like "web design Vaughan" puts you in front of those people.',
        ],
      },
      {
        h: 'Where I work',
        p: ['Vaughan, Woodbridge, Maple, Concord, Kleinburg, Richmond Hill, Markham, and the wider GTA.'],
      },
    ],
    faq: [
      {
        q: 'How long does local SEO take?',
        a: 'Local results can start to show in a few months. Wider rankings take longer. No one can honestly promise a set ranking, and I do not.',
      },
      {
        q: 'Do you only do SEO?',
        a: 'No. SEO is one part of the system. I also build conversion-focused websites and automated email follow-up.',
      },
    ],
    related: ['web-design-vaughan', 'web-design-markham', 'web-design-richmond-hill'],
  },
  {
    // target: "web design markham" (480/mo, KD 12)
    slug: 'web-design-markham',
    metaTitle: 'Web Design Markham | Conversion-Focused Websites',
    metaDescription:
      'Web design for Markham businesses. Websites planned around one goal: more calls, bookings, and sales. 30-day money-back guarantee. Free audit.',
    eyebrow: 'Web design in Markham',
    h1: 'Web design for Markham businesses that want more customers.',
    lead:
      'If your site gets visits but few inquiries, the problem is rarely the traffic. It is what happens after someone lands. I help Markham businesses fix that.',
    sections: [
      {
        h: 'What I change',
        items: [
          'The first screen, so visitors know what you do and who it is for',
          'The path to contact you, so it takes one clear step',
          'Mobile speed and layout, where most visits happen',
          'Tracking, so we can see what works',
        ],
      },
      {
        h: 'Start with a free audit',
        p: [
          'I review your site and send you what I would fix first. If you want help after that, we book a short call. If not, you keep the audit.',
        ],
      },
      {
        h: 'Serving Markham and nearby',
        p: ['Markham, Unionville, Thornhill, Richmond Hill, and Vaughan. I am based in Vaughan.'],
      },
      {
        h: 'Guarantee',
        p: [
          'Not happy with your new website within 30 days of launch? You choose a full refund, or I keep working at no extra cost until you are happy.',
        ],
      },
    ],
    faq: [
      {
        q: 'Do you work with stores as well as service businesses?',
        a: 'Yes. I build for online stores on Shopify and Next.js, and for service businesses that take inquiries.',
      },
      {
        q: 'Do we need to meet in person?',
        a: 'No. Most of the work is done online, and we can meet by video or phone.',
      },
    ],
    related: ['web-design-vaughan', 'web-design-richmond-hill', 'seo-vaughan'],
  },
  {
    // target: "web design richmond hill" (390/mo, KD 17)
    slug: 'web-design-richmond-hill',
    metaTitle: 'Web Design Richmond Hill | Websites That Convert',
    metaDescription:
      'Richmond Hill web design focused on results. Clear messaging, fast mobile pages, and a free audit to show where your site loses leads.',
    eyebrow: 'Web design in Richmond Hill',
    h1: 'Richmond Hill web design focused on getting you leads.',
    lead:
      'You already spend time and money to get people to your site. I make sure more of them take the next step, whether that is a call, a booking, or a purchase.',
    sections: [
      {
        h: 'Three places leads get lost',
        items: [
          'Visit, then leave: the site does not give people a reason to act.',
          'Inquire, then wait: a warm lead goes cold with no follow-up.',
          'Not ready, then forgotten: nothing keeps you in mind until they are ready to buy.',
        ],
      },
      {
        h: 'How I fix them',
        items: [
          'A website built around one clear goal',
          'Automated email follow-up for leads who are not ready yet',
          'Search basics, so people in Richmond Hill can find you',
        ],
      },
      {
        h: 'Serving Richmond Hill and nearby',
        p: ['Richmond Hill, Oak Ridges, Thornhill, Markham, Vaughan, and Aurora.'],
      },
      {
        h: 'Free audit first',
        p: ['Tell me about your business and your site. You get an audit by email that shows what I would fix first.'],
      },
    ],
    faq: [
      {
        q: 'What does it cost?',
        a: 'The audit is free. A build is quoted on a short call after the audit, before any work starts.',
      },
      {
        q: 'How long does a new site take?',
        a: 'It depends on the size of the project. I give you a clear timeline in the quote.',
      },
    ],
    related: ['web-design-vaughan', 'web-design-markham', 'seo-vaughan'],
  },
  {
    // target: "email marketing agency toronto" (90/mo, KD 9), "klaviyo agency" (30/mo),
    // "email automation services" (40/mo). Low volume: this page exists mainly to convert, not to rank.
    slug: 'email-marketing-automation',
    metaTitle: 'Email Marketing Automation | Klaviyo Setup for GTA Businesses',
    metaDescription:
      'Automated welcome, nurture, abandoned cart and win-back emails for GTA businesses. 90-day money-back guarantee. Start with a free audit.',
    eyebrow: 'Automated email follow-up',
    h1: 'Email follow-up that runs on its own.',
    lead:
      'A lead who is not ready today is forgotten tomorrow, unless you follow up. I build email systems that keep you top of mind, so people think of you first when they are ready to buy.',
    sections: [
      {
        h: 'What I build',
        items: [
          'Welcome and nurture emails',
          'Abandoned cart and post-purchase emails for online stores',
          'Win-back emails for past customers',
          'Follow-up for high-ticket, one-to-one services',
          'Setup in Klaviyo, connected to your forms and CRM',
        ],
      },
      {
        h: 'Why it works',
        p: [
          'Most leads slip away between "I asked" and "I waited", or between "not ready" and "forgotten". Automatic follow-up covers both gaps, and you do not have to remember to send anything.',
        ],
      },
      {
        h: 'Guarantee',
        p: [
          'Not happy with your email system within 90 days of launch? You choose a full refund, or I keep working at no extra cost until you are happy.',
        ],
      },
    ],
    faq: [
      {
        q: 'Do you work with Shopify stores?',
        a: 'Yes. Shopify and Klaviyo are a big part of my work.',
      },
      {
        q: 'Can you connect my CRM?',
        a: 'Yes. I connect forms, your CRM, and your email so leads are handled without manual steps.',
      },
      {
        q: 'What does it cost?',
        a: 'The audit is free. You get a clear quote on a short call before any work starts.',
      },
    ],
    related: ['web-design-vaughan', 'seo-vaughan'],
  },
]

export const getPage = (slug: string) => LOCAL_PAGES.find((p) => p.slug === slug)

// Blog posts moved to their own file; re-exported so existing imports keep working.
export { POSTS, getPost } from './blog-posts'
export type { Post } from './blog-posts'
