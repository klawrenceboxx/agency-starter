// Blog posts (/blog/<slug>), written to the locked blog template:
// quick answer → proof line → main table → question H2s (answer first) → field section → FAQ → bridge CTA → author box.
// Keyword targets: Semrush Canada database, October 2026 (volume / keyword difficulty per entry).
// Copy rules (BUSINESS.md): 6th-grade reading level, one primary conversion (the free audit), no invented stats.
// Every outside number links to its source. Field data comes from Kaleel's own October 2026 review of
// 10 Vaughan Chamber of Commerce member homepages (businesses not named) and his own Semrush pulls.
// Inline marks in any string: **bold** and [label](href).

import { MORE_POSTS } from './blog-posts-more'

export type Table = { caption: string; head: string[]; rows: string[][]; note?: string }
export type Block = { h: string; answer?: string; p?: string[]; items?: string[]; ordered?: boolean; table?: Table; after?: string[] }
export type Faq = { q: string; a: string }

export type Post = {
  slug: string
  metaTitle: string
  metaDescription: string
  h1: string
  quickAnswer: string
  proofLine: string
  published: string
  updated: string
  mainTable: Table
  sections: Block[]
  field: Block
  faq: Faq[]
  bridge: string
  next: string
}

const AUDIT = '/audit'
const IDEA = 'https://ideamarketing.ca/how-much-does-a-website-cost-in-canada/'
const GODADDY = 'https://www.godaddy.com/resources/ca/launch/how-much-does-it-cost-to-build-a-website-in-canada'
const STORYTELLER = 'https://storytellermedia.ca/seo-cost-canada/'
const AHREFS = 'https://ahrefs.com/blog/seo-pricing/'

const BASE_POSTS: Post[] = [
  {
    // primary: "how much does a website cost in canada" (110/mo, KD 4)
    // cluster: "how much does a website cost" (260, KD 43), "website design cost" (210, KD 23), "web design cost" (110, KD 44),
    // "shopify website cost" (70, KD 48), "how long does it take to build a website" (30), "small business website cost" (20),
    // "website redesign cost" (20)
    slug: 'how-much-does-a-website-cost-in-canada',
    metaTitle: 'How Much Does a Website Cost in Canada? (2026 Prices)',
    metaDescription:
      'How much a website costs in Canada in 2026: build prices for builders, freelancers and agencies, monthly costs, and how to avoid a site that does not sell.',
    h1: 'How much does a website cost in Canada?',
    quickAnswer:
      'Most small business websites in Canada cost $1,000 to $10,000 to build with a freelancer or small agency. Running one costs about $10 to $150 a month for hosting, a domain and upkeep. A do-it-yourself builder can cost under $500 a year. Online stores usually start around $2,000 and can pass $30,000.',
    proofLine:
      "I'm Kaleel Lawrence-Boxx. I build websites and Shopify stores for small businesses from Vaughan, and every project starts with a free audit and a written quote. Below is how pricing really works, using 2026 Canadian price data and what I find when I review local business sites.",
    published: '2026-10-12',
    updated: '2026-10-25',
    mainTable: {
      caption: 'What a website costs to build in Canada (2026, CAD)',
      head: ['Option', 'Build cost', 'Best for'],
      rows: [
        ['Website builder (Wix, Squarespace, GoDaddy)', 'About $170 to $340 a year in plan fees', 'Testing an idea on a small budget'],
        ['Freelancer, 5-page site', '$500 to $2,500', 'A simple service business'],
        ['Freelancer, small business site', '$1,000 to $5,000+', 'A service business that needs more pages'],
        ['Small agency, small business site', '$3,500 to $20,000+', 'More pages and more custom work'],
        ['Online store', '$2,000 to $30,000+', 'Selling products online'],
        ['Large agency or custom build', '$20,000 to $100,000+', 'Big sites with custom features'],
      ],
      note: `Ranges from [Idea Marketing's 2026 Canadian web design pricing guide](${IDEA}) and [GoDaddy Canada's 2026 website cost guide](${GODADDY}). All prices in Canadian dollars.`,
    },
    sections: [
      {
        h: 'What makes a website cost more?',
        answer:
          'Five things set the price of a website: how many pages it has, who writes the words, whether it sells products, what it has to connect to, and who builds it. A five-page site with your own words costs far less than a 40-page site with booking, payments and a custom design.',
        items: [
          '**Pages.** More pages, and more pages with their own layout, means more design and build time.',
          "**Words and photos.** If you write the copy and supply photos, you pay less. If someone else writes them, that's real time on the bill.",
          '**Selling online.** Products, sizes and colours, shipping, tax and customer accounts all add work.',
          '**Connections.** Booking, payments, email signup and your CRM each need setup and testing.',
          `**Who builds it.** Freelancers charge less per hour than agencies. [Idea Marketing](${IDEA}) lists $40 to $100 an hour for Canadian freelancers and $75 to $200 for small agencies.`,
        ],
        after: [
          `Here's the part most quotes skip: you may not need a new site at all. A few fixes to the top of your homepage and your contact form often do more than a rebuild. A [free website audit](${AUDIT}) shows which one you need before you spend anything.`,
        ],
      },
      {
        h: 'How much does a small business website cost?',
        answer:
          "A five-page small business website costs about $500 to $2,500 with a freelancer and $2,500 to $7,000 with a small agency in Canada, based on Idea Marketing's 2026 price guide. Bigger service sites with 15 to 20 pages cost more.",
        p: [
          "Five pages is the usual start: home, services, about, contact, and one more. Most service businesses don't need more than that on day one. What they need is for those five pages to do one job well: get a visitor to call, book or ask for a quote.",
          "Be careful with quotes far below this range. They usually mean a template with your logo dropped in. That's fine for some businesses, but ask exactly what's included before you compare prices.",
        ],
      },
      {
        h: 'How much does a Shopify website cost?',
        answer:
          "A Shopify store built by a freelancer usually costs $2,000 to $8,000 in Canada, and $5,000 to $30,000 or more with a small agency, per Idea Marketing's 2026 guide. On top of the build, you pay Shopify a monthly plan fee, card processing fees, and the cost of any paid apps.",
        p: [
          "Shopify sets its own plan prices, and they change. Check [Shopify's Canadian pricing page](https://www.shopify.com/ca/pricing) for today's numbers instead of trusting any blog post, including this one.",
          'The build price grows with the number of products, product options like size and colour, and custom features. A store with 20 products and simple shipping is a very different job from one with 500 products and several warehouses.',
          'One cost store owners forget: getting shoppers to come back. An abandoned cart email can win back people who left without buying. I set those up as part of my [email follow-up service](/services/email-marketing-automation).',
        ],
      },
      {
        h: 'How much does a website redesign cost?',
        answer:
          'A full website redesign usually costs about the same as a new build of the same size, because most of the work is the same. A targeted fix to the pages that lose leads costs much less, and it is often the better first step.',
        p: [
          "Before you pay for a full redesign, find out where your current site loses people. Is it the headline? A form that's too long? A phone number you can't tap? Those fixes take days, not weeks.",
          "I wrote a [website checklist](/blog/website-conversion-checklist-small-business) you can run on your own site in about 15 minutes. If you miss most of the checks, a redesign may be worth it. If you miss one or two, it probably isn't.",
        ],
      },
      {
        h: 'What does a website cost every month?',
        answer:
          'Expect to pay about $10 to $150 a month to run a small business website in Canada. That covers hosting, your domain name and a security certificate. Paid maintenance, email tools and apps cost extra if you need them.',
        table: {
          caption: 'Ongoing website costs in Canada (2026, CAD)',
          head: ['Cost', 'Typical price'],
          rows: [
            ['Hosting', '$2 to $150 a month'],
            ['Domain name renewal', '$10 to $25 a year'],
            ['Security certificate (SSL)', '$0 to $250 a year, often free with hosting'],
            ['Maintenance from a small agency', '$50 to $600 a month'],
            ['Email marketing tool', '$20 to $300 a month'],
            ['Plugins and apps', '$100 to $1,000 a year'],
          ],
          note: `Source: [Idea Marketing, 2026](${IDEA}).`,
        },
        after: ["On a builder like Wix or Squarespace, hosting is part of the plan. On Shopify, it's part of the Shopify plan."],
      },
      {
        h: 'How long does it take to build a website?',
        answer:
          "A small business website takes about 1 to 3 months with a freelancer and 1 to 6 months with a small agency, according to Idea Marketing's 2026 guide. My standard build takes five weeks from kickoff to launch.",
        items: [
          'Week 1: access, measuring where you are now, and kickoff',
          'Weeks 2 and 3: design and build',
          'Week 4: your review and two rounds of changes',
          'Week 5: launch',
        ],
        after: ["The biggest delay is almost never the code. It's waiting on words, photos and logins. Have those ready and any project moves faster."],
      },
      {
        h: 'Is a cheap website worth it?',
        answer:
          "A cheap website is worth it only if it brings in customers. The real cost of a website isn't the build price. It's the leads you lose every month when visitors land on your site and leave without calling, booking or buying.",
        p: [
          "Here's some simple math with made-up but realistic numbers. Say you spend $500 a month on ads and send 300 people to your site. If 1 in 100 reaches out, that's 3 leads. If a better page gets 3 in 100 to reach out, that's 9 leads from the same $500.",
          "Same ad spend. Three times the leads. That gap is what a website is really worth, and it's why I plan every site around one goal before any design starts. You can see how that works on my [Vaughan web design page](/services/web-design-vaughan).",
        ],
      },
      {
        h: 'How do you get an honest website quote?',
        answer:
          "To get an honest quote, tell the designer what the site needs to do, not just how it should look. Then ask what's included, what costs extra later, how long it takes, and what happens if you're not happy. A good designer answers all four in writing.",
        items: [
          'What is the one action this site should get visitors to take?',
          'Who writes the words, and who supplies the photos?',
          'What costs extra after launch: hosting, updates, apps?',
          'How long will it take, and what do you need from me?',
          "What happens if I'm not happy after launch?",
        ],
        after: [
          "My answer to the last one: if you're not happy with your website within 30 days of launch, you choose a full refund, or I keep working at no extra cost until you are. For more questions to ask, read [how to choose a web designer](/blog/how-to-choose-a-web-designer).",
        ],
      },
    ],
    field: {
      h: 'What I see when I review local business websites',
      answer:
        'In October 2026, I reviewed the homepages of 10 Vaughan Chamber of Commerce member businesses. Only 1 of the 10 scored full marks for answering doubts about price, process or guarantees near its main button. Half had nothing on any of the three.',
      p: [
        "That matters to you twice. As a buyer, a web designer who won't explain how they price is hard to compare. As a business owner, your own customers have the same question you have right now: what will this cost me? Answering it, even with a range, is one of the cheapest fixes there is.",
        'The full results from all 10 sites are in my [website checklist](/blog/website-conversion-checklist-small-business).',
      ],
    },
    faq: [
      {
        q: 'How much does a 5-page website cost in Canada?',
        a: "A 5-page website costs about $500 to $2,500 with a freelancer, $2,500 to $7,000 with a small agency, and $7,000 to $15,000 with a large agency in Canada, based on Idea Marketing's 2026 pricing guide.",
      },
      {
        q: 'How much does a website cost per month?',
        a: 'Most small business websites cost about $10 to $150 a month to run. That covers hosting, the domain name and security. Maintenance plans, email tools and paid apps cost extra.',
      },
      {
        q: 'Can I build a website for free?',
        a: "Yes. Builders like Wix have free plans, but they show the builder's branding and don't let you use your own domain name. Most businesses outgrow a free plan quickly.",
      },
      {
        q: 'Is it cheaper to hire a freelancer or an agency?',
        a: "A freelancer is usually cheaper. Idea Marketing's 2026 guide lists $40 to $100 an hour for Canadian freelancers and $75 to $200 an hour for small agencies. Agencies can take on bigger projects with more people.",
      },
      {
        q: 'Does the price of a website include SEO?',
        a: 'Not always, so ask. Basic search setup like page titles, speed and a sitemap should come with any build. Ongoing SEO is usually a separate monthly cost. See [how much SEO costs in Canada](/blog/how-much-does-seo-cost-in-canada).',
      },
    ],
    bridge: `Not sure if you need a new website or just a few fixes? Start with a [free website audit](${AUDIT}). I'll show you where your site loses visitors and what I'd fix first, before you spend a dollar.`,
    next: 'how-to-choose-a-web-designer',
  },
  {
    // primary: "seo cost" (210/mo, KD 11)
    // cluster: "seo pricing" (260, KD 47), "how much does seo cost" (170, KD 47), "is seo worth it" (140, KD 25),
    // "local seo cost" (90, KD 26), "local seo pricing" (90, KD 26), "seo packages canada" (70, KD 18),
    // "how long does seo take" (30), "is seo worth it for small business" (30)
    slug: 'how-much-does-seo-cost-in-canada',
    metaTitle: 'SEO Cost in Canada: 2026 Prices for Small Businesses',
    metaDescription:
      'SEO cost in Canada for 2026: monthly retainers, hourly rates, project fees and local SEO pricing, plus what you should get for the money and the red flags.',
    h1: 'How much does SEO cost in Canada?',
    quickAnswer:
      "SEO in Canada usually costs $500 to $5,000 a month on a retainer, $70 to $180 an hour, or $175 to $5,000 or more per project. In Ahrefs' survey of SEO providers, 79% of those in the U.S. and Canada charged at least US$1,001 a month. Local SEO for one small business is usually at the lower end.",
    proofLine:
      'I run Boxx Automations in Vaughan, where I set up local search for small businesses as part of my website work. Before I recommend any SEO, I measure what people in the area actually search for. Those numbers are in this post too.',
    published: '2026-10-25',
    updated: '2026-10-25',
    mainTable: {
      caption: 'SEO pricing in Canada by pricing model (2026)',
      head: ['Pricing model', 'Typical cost', 'What you usually get'],
      rows: [
        ['Monthly retainer', '$500 to $5,000+ a month', 'Ongoing work: fixes, content, links and reports'],
        ['Hourly', '$70 to $180 an hour', 'Advice or one-off tasks, billed by time'],
        ['Project', '$175 to $5,000+', 'A set job, like an audit or a site move'],
        ['Performance-based', '5% to 20% of new revenue', 'A fee tied to results above a starting point'],
      ],
      note: `Canadian ranges from [Storyteller Media's SEO cost guide](${STORYTELLER}). Survey figures in this post are from [Ahrefs' poll of 439 SEO providers](${AHREFS}), in U.S. dollars.`,
    },
    sections: [
      {
        h: 'How much does SEO cost per month?',
        answer:
          "Most monthly SEO retainers in Canada cost $500 to $5,000. In Ahrefs' survey, the single most common retainer was US$501 to $1,000 a month, charged by 20.4% of providers. But among U.S. and Canadian providers, 79.1% charged at least US$1,001 a month.",
        p: [
          'Why such a wide range? A retainer pays for time. A plumber serving one town needs far fewer hours than an online store competing across Canada. The more keywords, pages and competitors involved, the more hours the job takes.',
          `Experience matters too. [Ahrefs](${AHREFS}) found that providers with more than two years in business charged an average of US$2,023 a month, about 33% more than newer ones.`,
        ],
      },
      {
        h: 'How much does local SEO cost?',
        answer:
          'Local SEO usually sits at the lower end of SEO pricing, because the job is smaller: one area, fewer keywords and fewer competitors. A lot of local SEO is setup work you do once, not something that needs a big fee every month.',
        p: ['Here is what good local SEO setup covers:'],
        items: [
          'A complete, verified Google Business Profile with the right categories and services',
          'Your business name, address and phone written the same way everywhere',
          'Listings on Apple Maps, Bing, Yelp, Yellow Pages Canada and your local chamber of commerce',
          'One clear page on your website for each service you sell',
          'A simple, honest way to ask happy customers for reviews',
        ],
        after: [
          "Most of that is done once. If someone charges a monthly fee to keep doing setup that's already finished, ask what changes each month.",
          'I set up these local search basics as part of my website work. You can see what is included on my [SEO services page](/services/seo-vaughan).',
        ],
      },
      {
        h: 'What do SEO packages in Canada include?',
        answer:
          'A typical SEO package includes a technical check of your site, keyword research, page fixes like titles and headings, local listings, new content, link building, and a monthly report. Cheaper packages often skip content and links, which do a lot of the work.',
        items: [
          '**Technical fixes:** speed, broken links, and pages Google cannot read',
          '**Keyword research:** what your customers actually type, and how often',
          '**Page fixes:** titles, descriptions and headings written for the searcher',
          '**Local listings:** your Google Business Profile and directory listings',
          '**Content:** service pages and blog posts that answer real questions',
          '**Links:** other trusted sites linking to yours',
          '**Reporting:** rankings, traffic and, most important, leads',
        ],
        after: [
          'Ask for the list in writing, with how many hours or pieces of content you get each month. A package called "Gold" tells you nothing.',
          'Getting a new website built? The search basics should come with the build, not as an extra package. See [how much a website costs in Canada](/blog/how-much-does-a-website-cost-in-canada) for what a build should include.',
        ],
      },
      {
        h: 'How long does SEO take to work?',
        answer:
          'SEO usually takes months, not weeks. In a Google video on hiring an SEO, Google said SEOs typically need four months to a year to make improvements and see results. Local results from a complete Google Business Profile can come sooner.',
        p: [
          'Source: [Google, "How to Hire an SEO"](https://www.youtube.com/watch?v=piSvFxV_M04) (2017). SEO educator Jono Catliff puts local results at about one to three months, and regular SEO at up to a year or more, in [his local SEO walkthrough](https://www.youtube.com/watch?v=vwzV-YsVswA).',
          "Anyone who promises page one by a set date is guessing. Nobody controls Google's rankings.",
        ],
      },
      {
        h: 'Is SEO worth it for a small business?',
        answer:
          'SEO is worth it when people actually search for your service in your area, and your website turns visits into customers. If almost nobody searches for what you sell, or your site loses the visitors it already gets, fix that first.',
        p: [
          "The second part is where most money gets wasted. Ranking higher only helps if the page people land on makes it easy to call, book or buy. Otherwise you're paying to send more people to a leaky page.",
          `That's why I check the page itself before I touch rankings. A [free website audit](${AUDIT}) covers both, so you know where your money does the most good.`,
        ],
      },
      {
        h: 'What are the red flags when hiring an SEO company?',
        answer:
          "Be careful with any SEO company that guarantees a #1 ranking, won't explain what they do each month, keeps your accounts in their own name, or sells hundreds of links for a low price. Each one can cost you money, control, or your rankings.",
        items: [
          '**Ranking guarantees.** Nobody controls Google. A guarantee is a sales line.',
          '**Secret methods.** You should get a plain list of what was done each month.',
          '**They own your accounts.** Your Google Business Profile, Analytics and Search Console should be in your name.',
          '**Cheap bulk links or listings.** Hundreds of low-quality links can hurt more than help.',
          '**Long lock-in contracts.** Ask how you can leave, and what you keep if you do.',
        ],
      },
    ],
    field: {
      h: 'What people in Vaughan actually search for',
      answer:
        "Before I set up local SEO, I measure demand. In October 2026, Semrush's Canadian database showed about 720 searches a month for \"seo vaughan\" and 320 for \"web design vaughan\". Most other service searches in Vaughan had fewer than 50 a month.",
      table: {
        caption: 'Monthly searches in Vaughan and nearby (Semrush, Canada database, October 2026)',
        head: ['Search', 'Monthly searches'],
        rows: [
          ['seo vaughan', '720'],
          ['web design markham', '480'],
          ['web design richmond hill', '390'],
          ['web design vaughan', '320'],
          ['seo services vaughan', '260'],
          ['digital marketing vaughan', '170'],
          ['local seo vaughan', '70'],
          ['email marketing vaughan', '40'],
          ['shopify developer vaughan', '0'],
        ],
      },
      after: [
        "Two lessons. First, local numbers are small, and that's normal. Fifty people a month searching for exactly what you sell, close to you, can be worth more than thousands searching across the country.",
        "Second, check before you pay. If a company wants to rank you for a phrase nobody searches, you'll pay for a ranking that brings in no one.",
      ],
    },
    faq: [
      {
        q: 'How much does SEO cost per month in Canada?',
        a: 'Most Canadian SEO retainers cost $500 to $5,000 a month. The price depends on how many keywords, pages and competitors are involved, and how experienced the provider is.',
      },
      {
        q: 'How much does local SEO cost?',
        a: 'Local SEO usually costs less than national SEO because it covers one area and fewer keywords. Much of it is one-time setup, like your Google Business Profile, listings and service pages.',
      },
      {
        q: 'Is SEO a one-time cost?',
        a: 'Partly. Technical fixes and local setup are mostly one-time. Ranking for competitive searches usually takes ongoing work, like new content and links.',
      },
      {
        q: 'Can I do SEO myself?',
        a: 'Yes, for the basics. You can complete your Google Business Profile, ask customers for reviews, and write one clear page for each service. Paid help makes more sense for technical problems and competitive keywords.',
      },
      {
        q: 'How long does SEO take?',
        a: 'Google has said SEO usually takes four months to a year to show results. Local results from a complete Google Business Profile can come sooner.',
      },
    ],
    bridge: `Want to know if SEO is worth it for your business? Start with a [free website audit](${AUDIT}). I'll show you how your site performs today and what I'd fix first, before you pay for any ongoing work.`,
    next: 'how-much-does-a-website-cost-in-canada',
  },
  {
    // primary: "how to choose a web designer" (50/mo, KD 0)
    // cluster: "web designer near me" (720, KD 30), "web designer vs web developer" (50, KD 0),
    // "questions to ask a web designer" (20, KD 0), "how to hire a web designer" (20), "how to find a web designer" (20)
    slug: 'how-to-choose-a-web-designer',
    metaTitle: 'How to Choose a Web Designer: 10 Questions to Ask First',
    metaDescription:
      'How to choose a web designer for your small business: 10 questions to ask, red flags to avoid, and how to compare quotes. Plain answers from a Vaughan designer.',
    h1: 'How to choose a web designer',
    quickAnswer:
      "To choose a web designer, look past the portfolio and ask what the site will do for your business. Test that their live sites work, ask who writes the words, get the full cost in writing including hosting and updates, and ask what happens if you're not happy. Pick the one with clear answers.",
    proofLine:
      "I'm a web designer in Vaughan, so read this knowing that. I've also reviewed local business websites against a 20-point conversion check, and the mistakes I found show exactly what to ask before you hire anyone, including me.",
    published: '2026-10-25',
    updated: '2026-10-25',
    mainTable: {
      caption: 'Do it yourself, freelancer or agency? (Canada, 2026, CAD)',
      head: ['Option', 'Typical cost', 'Good fit if'],
      rows: [
        ['Website builder (do it yourself)', 'About $170 to $340 a year', 'You have more time than money'],
        ['Freelancer', '$40 to $100 an hour; $1,000 to $5,000+ for a small business site', 'You want one person doing the work'],
        ['Small agency', '$75 to $200 an hour; $3,500 to $20,000+', 'You need a team or a bigger build'],
        ['Large agency', '$100 to $300+ an hour; $20,000 to $100,000+', 'You need a large custom site'],
      ],
      note: `Sources: [Idea Marketing, 2026](${IDEA}) and [GoDaddy Canada, 2026](${GODADDY}). Full breakdown in [how much a website costs in Canada](/blog/how-much-does-a-website-cost-in-canada).`,
    },
    sections: [
      {
        h: 'What should you look for in a web designer?',
        answer:
          "Look for a web designer who asks about your customers and your goals before talking about colours and fonts. A good designer can name the one action your site should get visitors to take, and explain how you'll know it's working after launch.",
        p: [
          "A nice-looking portfolio is the easy part. Almost every designer has one. What's harder to find is someone who asks, \"Where do your customers come from, and what do they need to see before they call you?\"",
          "If the first meeting is all about style and none of it is about your business, you'll likely get a site that looks good and doesn't bring in much.",
        ],
      },
      {
        h: '10 questions to ask a web designer before you hire',
        answer:
          'Ask these 10 questions before you sign anything. The answers tell you what you will get, what it really costs, and whether the designer thinks about your business or only about the look.',
        ordered: true,
        items: [
          '**What should this site get visitors to do?** You want one clear answer, like book, call or request a quote.',
          '**Can I see three live sites you built?** Live sites, not screenshots. Then ask to speak with one of those clients.',
          '**Who writes the words?** Copy sells. If you are writing it, ask for help with structure.',
          '**What does it cost after launch?** Hosting, domain, updates and paid apps, all in writing.',
          '**Who owns the site, the domain and the logins?** The answer should be you.',
          '**How long will it take, and what do you need from me?** Delays usually come from missing content, not code.',
          '**Will it work well on a phone?** Ask them to show you a past site on their own phone.',
          '**How will we know if it is working?** Look for tracking of calls, forms and bookings.',
          '**What search basics are included?** Page titles, speed, a sitemap and a Google Business Profile link at minimum.',
          "**What happens if I'm not happy?** Get the answer in writing before you pay.",
        ],
        after: [
          'If you want to see how I answer these, my [Vaughan web design page](/services/web-design-vaughan) walks through the process, and my guarantee is in writing.',
        ],
      },
      {
        h: 'Web designer vs web developer: what is the difference?',
        answer:
          'A web designer plans how a site looks and works for visitors: the layout, the words on the page, the buttons and the flow. A web developer writes the code that makes it run. Many small business sites are built by one person who does both, which is often simpler and cheaper.',
        p: [
          "For a five-page service site, you rarely need separate people. For an online store with custom features, or a site that connects to other systems, a developer's skills matter more.",
          'Either way, ask which parts they do themselves and which parts they hand off to someone else.',
        ],
      },
      {
        h: 'How do you find a good web designer near you?',
        answer:
          'Start with referrals from other business owners, your local chamber of commerce, and Google reviews. Then look at the live sites each designer has built, not just screenshots, and press every button on them. A designer whose own site is slow or broken will likely build you the same.',
        p: [
          "Meeting in person is nice but not required. Most of the work happens online. What matters more is that they reply when they say they will, because that's how the whole project will go.",
        ],
      },
      {
        h: 'What are the red flags when hiring a web designer?',
        answer:
          "Walk away from a designer who can't show live work, won't put the price in writing, keeps your domain or logins in their own name, or promises a #1 Google ranking. Each one costs you money or control later.",
        items: [
          '**No live work.** Screenshots can hide a lot.',
          "**No written price.** If it isn't written down, it can change.",
          '**They keep your domain or logins.** Leaving them later becomes hard and expensive.',
          '**Ranking promises.** Nobody controls Google.',
          '**No questions about your customers.** They are designing for themselves, not for your buyers.',
        ],
        after: [
          `Not sure your current site even needs replacing? A [free website audit](${AUDIT}) shows where it loses visitors, and you keep the results whether you hire me or not.`,
        ],
      },
      {
        h: 'How do you compare website quotes?',
        answer:
          "Compare website quotes by what's included, not by the bottom number. Put the quotes side by side and check pages, who writes the words, search setup, tracking, rounds of changes, launch support and costs after launch. The cheapest quote often leaves the most out.",
        items: [
          'Number of pages, and which ones get their own design',
          'Who writes the words, and who supplies photos',
          'Search basics and Google Business Profile setup',
          'Tracking for calls, forms and bookings',
          'How many rounds of changes are included',
          'Hosting, domain and maintenance costs after launch',
          'What happens if you are not happy',
        ],
        after: ['For typical prices, read [how much a website costs in Canada](/blog/how-much-does-a-website-cost-in-canada).'],
      },
    ],
    field: {
      h: 'What I find when I press every button',
      answer:
        'When I reviewed 10 Vaughan Chamber of Commerce member homepages in October 2026, 3 had a main quote or booking button, or a form, that did not work. Two still showed leftover placeholder text, like "Your Content Goes Here" and a price range of "$000 - $000".',
      p: [
        'Nobody tells you your button is broken. Visitors just leave. That is why question 2 matters so much: open a designer\'s past sites on your phone and press every button. It takes five minutes, and it tells you more than any portfolio.',
        'The full results are in my [website checklist](/blog/website-conversion-checklist-small-business).',
      ],
    },
    faq: [
      {
        q: 'How much does it cost to hire a web designer in Canada?',
        a: "Canadian freelance web designers charge about $40 to $100 an hour, and small agencies about $75 to $200 an hour, per Idea Marketing's 2026 guide. A small business site usually costs $1,000 to $5,000 or more with a freelancer.",
      },
      {
        q: 'Should I hire a local web designer?',
        a: "A local designer can meet you in person and may know your market, which helps. It isn't required. Clear communication, live work you can test, and a price in writing matter more.",
      },
      {
        q: 'Should I own my website and domain?',
        a: "Yes. Your domain, hosting account and website logins should be in your name or your business's name. If a designer won't agree to that, look elsewhere.",
      },
      {
        q: 'What is the difference between a web designer and a web developer?',
        a: 'A designer plans how the site looks and works for visitors. A developer writes the code. Many small business sites are built by one person who does both.',
      },
    ],
    bridge: `If you're comparing designers, start by knowing what your current site is doing. Get a [free website audit](${AUDIT}) and use it to brief whoever you hire, including me.`,
    next: 'website-conversion-checklist-small-business',
  },
  {
    // primary: "website checklist" (50/mo, KD 35)
    // cluster: "landing page best practices" (50, KD 0), "website launch checklist" (30, KD 0),
    // "website conversion checklist" (10), "landing page checklist" (10)
    slug: 'website-conversion-checklist-small-business',
    metaTitle: 'Website Checklist: 10 Conversion Checks for Small Business',
    metaDescription:
      'A website checklist for small businesses: 10 checks that show why visitors don\'t call, book or buy, with real scores from 10 Vaughan business websites.',
    h1: 'Website checklist: 10 conversion checks for small businesses',
    quickAnswer:
      'Use this website checklist to find out why visitors aren\'t contacting you. Score 10 things from 0 to 2: one clear action, a clear offer, why you\'re different, proof, answers to doubts, easy navigation, plain button text, phone-friendly layout, a working form, and a way to stay in touch. 16 or more out of 20 is solid.',
    proofLine:
      'This is the same 10-point check I use when I review a business website. In October 2026, I ran it on 10 Vaughan Chamber of Commerce member homepages. Their results are below, so you can compare your score.',
    published: '2026-10-12',
    updated: '2026-10-25',
    mainTable: {
      caption: 'How 10 Vaughan business homepages scored (October 2026)',
      head: ['Check', 'Average score (out of 2)', 'Sites with full marks'],
      rows: [
        ['1. One clear action', '1.5', '5 of 10'],
        ['2. Clear offer', '1.3', '3 of 10'],
        ['3. Why you\'re different', '1.2', '2 of 10'],
        ['4. Proof near the button', '1.2', '2 of 10'],
        ['5. Answers to doubts', '0.6', '1 of 10'],
        ['6. Easy navigation', '1.6', '6 of 10'],
        ['7. Plain button text', '1.1', '1 of 10'],
        ['8. Phone-friendly layout*', '1.0', 'Not tested'],
        ['9. Working form with a reply time', '0.9', '0 of 10'],
        ['10. A way to stay in touch*', '1.0', '0 of 10'],
      ],
      note: 'Homepage text review of 10 Vaughan Chamber of Commerce members, October 2026. Businesses aren\'t named. *Checks 8 and 10 were scored from page text only, so real phones and speed were not tested.',
    },
    sections: [
      {
        h: '1. Does your site ask for one clear action?',
        answer:
          'Your homepage should ask visitors to do one main thing, like book, call or request a quote, and repeat it near the top and the bottom. When two buttons compete for the same spot, visitors often pick neither.',
        items: ['**2 points:** one main action, near the top and repeated lower down', '**1 point:** an action exists, but it competes with others', '**0 points:** no clear action at all'],
        after: ['**What I found:** half the sites scored full marks. The others had buttons competing for the same spot, a weak label, or no booking button at all.'],
      },
      {
        h: '2. Can a stranger tell what you do and who it\'s for?',
        answer:
          'In about five seconds, a stranger should know what you sell, who it\'s for, and what they get. A headline that only says you\'re good, trusted or the best doesn\'t answer any of those.',
        items: ['**2 points:** what, who and the result, in plain words', '**1 point:** what you do, but not who it\'s for', '**0 points:** a slogan that could fit any business'],
        after: ['**What I found:** only 3 of 10 scored full marks. The most common miss was a headline that said what the business does but not who it\'s for.'],
      },
      {
        h: '3. Do you say why someone should pick you?',
        answer:
          'Give one or two specific reasons to choose you over the next business. Numbers beat adjectives: years in business, jobs completed, response times or a named guarantee are believable. Words like quality and trusted aren\'t.',
        items: ['**2 points:** specific, checkable reasons', '**1 point:** one specific detail among generic claims', '**0 points:** only generic claims'],
        after: ['**What I found:** 2 of 10 scored full marks. The strong ones used plain numbers, like how many homes they\'d tested or how many design options they offer.'],
      },
      {
        h: '4. Is there real proof near your main button?',
        answer:
          'Put proof where people decide: next to your main button or form. Real proof is a named customer review with context, a real result, or a licence or certification that explains what it means. Logos alone do little.',
        items: ['**2 points:** named reviews with context, close to the action', '**1 point:** some proof, but vague or far from the action', '**0 points:** no proof at all'],
        after: [
          '**What I found:** 2 of 10 scored full marks. Several showed logos or awards but no named customer reviews.',
          `Proof is the easiest thing to skip. If you're not sure what yours should be, a [free website audit](${AUDIT}) points to the one or two pieces worth adding first.`,
        ],
      },
      {
        h: '5. Do you answer the doubts that stop people from reaching out?',
        answer:
          'Most visitors have three doubts before they contact you: what will it cost, what happens next, and what if it goes wrong. Answer them near your main button with a price range or approach, a short process, and any guarantee you offer.',
        items: ['**2 points:** price approach, next steps and a guarantee or risk reducer', '**1 point:** one of the three', '**0 points:** none of them'],
        after: ['**What I found:** this was the weakest check. Half the sites scored zero, and only 1 of 10 scored full marks.'],
      },
      {
        h: '6. Can people find what they need in two clicks?',
        answer:
          'Visitors should reach any service, your contact details or your booking page within two clicks. Keep the menu short, use plain labels, and make sure every menu item goes to a real page.',
        items: ['**2 points:** short, clear menu, every link works', '**1 point:** mostly clear, with vague labels or dead menu items', '**0 points:** hard to find key pages'],
        after: ['**What I found:** the strongest check, with 6 of 10 full marks. The misses were menu items that linked nowhere and vague labels like "More".'],
      },
      {
        h: '7. Do your buttons say what happens next?',
        answer:
          'Button text should say what the visitor gets, like "Get my free quote" or "Book a 15-minute call". Buttons that say Submit, Send or Learn more don\'t tell people what they\'re agreeing to.',
        items: ['**2 points:** every main button says what happens next', '**1 point:** some buttons are clear, others are generic', '**0 points:** all generic'],
        after: ['**What I found:** only 1 of 10 scored full marks. Generic labels like Submit, Send and Learn more showed up on several sites.'],
      },
      {
        h: '8. Does your site work well on a phone?',
        answer:
          'Most visitors arrive on a phone. Open your own site on your phone, on mobile data and not Wi-Fi. It should load quickly, the text should be easy to read, nothing should overlap, and your phone number should be tappable.',
        items: ['**2 points:** fast, readable, tappable, nothing breaks', '**1 point:** works, but slow or awkward', '**0 points:** broken on a phone'],
        after: ['**What I found:** I didn\'t score this one fully, because a text review can\'t test real phones. Test yours today. It takes two minutes.'],
      },
      {
        h: '9. Does your form work, and does it say when you will reply?',
        answer:
          'Fill in your own form and check three things: it sends, a confirmation shows, and the message reaches you. Ask only for what you need, and tell people when they will hear back, like "We reply within one business day".',
        items: ['**2 points:** short form that works and promises a reply time', '**1 point:** works, but long or no reply time', '**0 points:** broken, missing, or the button goes nowhere'],
        after: ['**What I found:** none of the 10 scored full marks. Not one promised a reply time, and 3 had a main button or form that didn\'t work.'],
      },
      {
        h: '10. Do you stay in touch with people who aren\'t ready yet?',
        answer:
          'Most visitors aren\'t ready to buy on their first visit. Give them a reason to leave an email, like a short guide or checklist, and follow up automatically so you\'re the one they remember when they\'re ready.',
        items: ['**2 points:** an email signup with a reason to join, plus follow-up emails', '**1 point:** a signup with no follow-up, or only a contact form', '**0 points:** nothing'],
        after: [
          '**What I found:** none of the 10 scored full marks. Most offered only a contact form or a phone number.',
          'If you get inquiries that go quiet, automated [email follow-up](/services/email-marketing-automation) sends the welcome and the reminders for you.',
        ],
      },
      {
        h: 'Landing page best practices',
        answer:
          'A landing page is a single page with one goal, usually for an ad or a special offer. The 10 checks still apply, with tighter rules: one action repeated, no main menu pulling people away, a short form, and a headline that matches the ad that brought them there.',
        items: [
          'The headline repeats the promise from the ad or link',
          'One button, repeated, with the same wording each time',
          'Proof and answers to doubts right beside the form',
          'No main menu, so the only choice is the action',
          'A form with three or four fields at most',
        ],
      },
      {
        h: 'Website launch checklist: what to test before you go live',
        answer:
          'Before launch, test every button, form and phone link on a real phone. Check that each page has its own title and description, set up tracking for form submissions, and make sure your business name, address and phone match your Google Business Profile.',
        items: [
          'Every button and link goes to a real page',
          'Every form sends, and the message arrives',
          'Phone numbers can be tapped on a phone',
          'Each page has its own title and description',
          'Tracking records calls, forms and bookings',
          'Name, address and phone match your Google Business Profile',
          'A sitemap is submitted in Google Search Console',
        ],
      },
      {
        h: 'How do you score your website?',
        answer:
          'Add your 10 scores for a total out of 20. A score of 16 to 20 is solid. 10 to 15 means you\'re leaking leads. Under 10 means most visitors leave without acting. Fix your lowest-scoring check first, because one broken step can undo the rest.',
        p: [
          'Scored under 10? A rebuild may cost less than fixing everything one by one. See [how much a website costs in Canada](/blog/how-much-does-a-website-cost-in-canada), and if you hire help, ask these [10 questions before you choose a web designer](/blog/how-to-choose-a-web-designer).',
        ],
      },
    ],
    field: {
      h: 'What 10 Vaughan business websites taught me',
      answer:
        'The average score across the 10 sites was 11.4 out of 20. Eight were leaking leads, two were losing most visitors, and none scored solid. Almost every fix was small: a clearer button, a reply-time promise, or a link that actually works.',
      p: [
        'The most common gap was what happens after someone reaches out. Not one site told visitors when they would hear back. That\'s a one-line fix, and it costs nothing.',
        'Several of these businesses have been around for 25 years or more. A strong reputation offline doesn\'t fix a weak homepage, and the reverse is true too: a few small changes can make an established business look as good online as it\'s in person.',
      ],
    },
    faq: [
      {
        q: 'What should be on a small business website?',
        a: 'At minimum: a clear headline saying what you do and who it\'s for, one main action, proof like named reviews, a short working form with a reply time, your contact details, and one page for each service you sell.',
      },
      {
        q: 'What is a good website conversion rate?',
        a: 'It depends on your industry and what counts as a conversion. Rather than chasing an average, measure your own rate now, make one change, and compare the next month.',
      },
      {
        q: 'How often should I check my website?',
        a: 'Run this checklist at least once a quarter, and after any change to your site, your forms or your hosting. Test your contact form every month.',
      },
      {
        q: 'What is the difference between a website and a landing page?',
        a: 'A website has many pages for different visitors and goals. A landing page is one page with one goal, usually for an ad or an offer, with fewer ways to click away.',
      },
    ],
    bridge: `Want a second pair of eyes? Get a [free website audit](${AUDIT}). I'll run these checks on your site and tell you what I'd fix first.`,
    next: 'how-much-does-a-website-cost-in-canada',
  },
]

export const POSTS: Post[] = [...BASE_POSTS, ...MORE_POSTS]

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug)
