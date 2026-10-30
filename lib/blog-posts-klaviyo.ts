// Batch 3 blog posts (Oct 30, 2026): the Klaviyo cluster. Same locked template and rules as lib/blog-posts.ts.
// Keyword targets from Semrush Canada database, October 2026 (volume / KD), per the SEO Data sheet keyword bank.
// Pricing rule: no number appears here unless it links to a source. Klaviyo's own pricing page only shows the free plan
// to a crawler, so paid tiers cite two independent price trackers that agree. Re-check all prices before each update.
// Prices are US dollars, as published by each vendor. Do not convert to CAD in copy (the rate moves).
import type { Post } from './blog-posts'

const AUDIT = '/audit'
const EMAIL = '/services/email-marketing-automation'
const KLAVIYO_PRICING = 'https://www.klaviyo.com/pricing'
const CARLY = 'https://www.usecarly.com/blog/klaviyo-pricing/'
const OPTIMIZE = 'https://www.emailoptimize.com/blog/klaviyo-pricing'
const OMNISEND_PRICING = 'https://www.omnisend.com/pricing/'
const MAILCHIMP_PRICING = 'https://mailchimp.com/pricing/marketing/'

export const KLAVIYO_POSTS: Post[] = [
  {
    // primary: "klaviyo pricing" (480, KD 26)
    // cluster: "klaviyo vs mailchimp" (50, KD 32), "klaviyo vs omnisend" (20)
    slug: 'klaviyo-pricing',
    metaTitle: 'Klaviyo Pricing in Canada (2026): What You Really Pay',
    metaDescription:
      'Klaviyo pricing, explained simply: the free plan, what 500 to 50,000 profiles cost, how active profiles are counted, and how to keep your bill down.',
    h1: 'Klaviyo pricing: what you really pay in 2026',
    quickAnswer:
      "Klaviyo is free for up to 250 active profiles and 500 email sends a month. Paid email plans start around US$20 a month for 500 profiles, US$30 for 1,000, US$60 for 2,500 and US$100 for 5,000. Your price depends on how many active profiles you have, not how many emails you send.",
    proofLine:
      "I build email follow-up in Klaviyo for online stores and service businesses, so I read these pricing tiers a lot. Klaviyo's public page only shows the free plan, so the paid prices below come from two independent price trackers that match each other. Check your own account before you budget.",
    published: '2026-10-30',
    updated: '2026-10-30',
    mainTable: {
      caption: 'Klaviyo email plan price by active profiles (US dollars per month)',
      head: ['Active profiles', 'Email plan'],
      rows: [
        ['Up to 250', 'Free (500 sends a month)'],
        ['Up to 500', '$20'],
        ['Up to 1,000', '$30'],
        ['Up to 2,500', '$60'],
        ['Up to 5,000', '$100'],
        ['Up to 10,000', '$150'],
        ['Up to 25,000', '$400'],
        ['Up to 50,000', '$720'],
      ],
      note: `Sources: [Email Optimize, checked 10 October 2026](${OPTIMIZE}) and [Carly, July 2026](${CARLY}). Both list the same prices. [Klaviyo's own pricing page](${KLAVIYO_PRICING}) shows only the free plan. Prices are in US dollars and change, so confirm in your account.`,
    },
    sections: [
      {
        h: 'Is Klaviyo free?',
        answer:
          'Yes, up to a point. The free plan covers up to 250 active profiles and 500 email sends a month. Go past either limit and you need a paid plan.',
        p: [
          `That's from [Klaviyo's pricing page](${KLAVIYO_PRICING}). It also lists a small monthly allowance for text messages and for its AI writing tool. The page doesn't say the free plan ends after a set time.`,
          "Free is enough to test the tool and run a welcome email for a small list. It gets tight fast. 500 sends sounds like a lot until one welcome email plus one weekly update goes to 250 people. (Spoiler: that's already 1,000.)",
        ],
      },
      {
        h: 'What is an "active profile"?',
        answer:
          'An active profile is a contact who can receive your marketing emails. Klaviyo prices by how many of these you have, not by how many emails you send.',
        p: [
          `Klaviyo defines it as [contacts who may receive marketing emails](${KLAVIYO_PRICING}). That means your price follows the size of your list, not how busy you are.`,
          "Here's the part people miss: sending more emails doesn't raise your price, but a bigger list does. Two small things can quietly push you up a tier. A list full of people who never open your emails, and a signup form that grabs everyone. Keep your list clean and you keep your tier lower.",
        ],
      },
      {
        h: 'How much does Klaviyo cost for a small business?',
        answer:
          'Most small businesses land between the free plan and about US$100 a month. That covers lists up to roughly 5,000 active profiles on the email plan.',
        p: [
          'Look at the table at the top of this post. A store with 1,000 profiles pays about US$30 a month. At 2,500 it is about US$60. At 5,000 it is about US$100.',
          "Klaviyo bills in US dollars. What that costs in Canadian dollars depends on the exchange rate on the day you're billed, so I won't pretend to give you a fixed Canadian number.",
        ],
      },
      {
        h: 'Does adding SMS change the price?',
        answer:
          'Yes. Text messages are billed separately, by credit, on top of your email plan. One tracker lists a minimum SMS add-on of about US$15 a month.',
        p: [
          `The [Carly price guide](${CARLY}) shows an "Email + SMS" column that adds that minimum on top of each email tier. SMS has its own consent rules in Canada, so don't turn it on just because the button exists.`,
          "If you're starting out, run email first. You can add texts later when your list and your emails are working.",
        ],
      },
      {
        h: 'How do you keep your Klaviyo bill down?',
        answer:
          'Keep your active profiles clean. Remove people who never open, stop collecting contacts you will never email, and check your count before each billing date.',
        items: [
          'Remove or suppress people who have not opened in a long time',
          'Do not import old lists you do not have permission to email',
          'Use a signup form that asks for consent clearly (CASL needs it anyway)',
          'Check your profile count every month, because tiers jump at set sizes',
          'Turn on automations before you pay for a bigger tier',
        ],
        after: [
          "That last one matters most. A paid plan with no automations switched on is a gym membership with a better logo.",
        ],
      },
      {
        h: 'Is Klaviyo worth the money?',
        answer:
          "It can be, if you run an online store and turn on the automations that make money: welcome, abandoned cart and post-purchase emails. If you only send one newsletter a month, a cheaper tool may do the job.",
        p: [
          `Not sure which fits you? Read the side-by-sides: [Klaviyo vs Mailchimp](/blog/klaviyo-vs-mailchimp) and [Klaviyo vs Omnisend](/blog/klaviyo-vs-omnisend).`,
          'Running a Shopify store? Start with [abandoned cart emails](/blog/abandoned-cart-emails). They are usually the first automation worth paying for.',
        ],
      },
    ],
    field: {
      h: 'How to work out your own Klaviyo price in 2 minutes',
      answer:
        "Open your Klaviyo account and find your number of active profiles, then match it to the table. That one number is your bill.",
      p: [
        "If you haven't signed up yet, count the people who have agreed to hear from you: customers, newsletter signups and people who asked a question. That is your starting number. If you are not sure those people said yes, fix that first. In Canada, [CASL](/blog/email-marketing-for-small-business) needs consent before you send.",
      ],
    },
    faq: [
      {
        q: 'How much is Klaviyo per month?',
        a: `It is free for up to 250 active profiles. Paid email plans start around US$20 a month for 500 profiles, per the price trackers [Email Optimize](${OPTIMIZE}) and [Carly](${CARLY}). Check your account for your exact price.`,
      },
      {
        q: 'Does Klaviyo charge by emails sent or by contacts?',
        a: `By active profiles, which means contacts who can receive your marketing emails, [per Klaviyo](${KLAVIYO_PRICING}). Each paid tier also comes with a monthly send limit.`,
      },
      {
        q: 'Is Klaviyo cheaper than Mailchimp?',
        a: 'It depends on your list size and what you need. Compare the same number of contacts on both pricing pages. The side-by-side post linked above shows how to do that.',
      },
      {
        q: 'Does Klaviyo have a free trial?',
        a: `It has a free plan rather than a timed trial. [Klaviyo's page](${KLAVIYO_PRICING}) lists up to 250 active profiles and 500 sends a month.`,
      },
      {
        q: 'Do I pay in Canadian dollars?',
        a: 'The published prices are in US dollars. Your actual charge depends on how your account is set up and the exchange rate, so check your billing page.',
      },
    ],
    bridge: `Already paying for Klaviyo and not sure it is earning its keep? Get a [free website audit](${AUDIT}). I'll check your signup, your forms and your follow-up, and tell you what I'd fix first.`,
    next: 'klaviyo-vs-mailchimp',
  },

  {
    // primary: "klaviyo vs mailchimp" (50, KD 32)
    slug: 'klaviyo-vs-mailchimp',
    metaTitle: 'Klaviyo vs Mailchimp (2026): Prices and Which to Pick',
    metaDescription:
      'Klaviyo vs Mailchimp for small business: how each one charges, what the free plans give you, and which fits an online store or a service business.',
    h1: 'Klaviyo vs Mailchimp: which should a small business pick?',
    quickAnswer:
      "Pick Klaviyo if you run an online store and want emails driven by what shoppers do, like abandoned carts. Pick Mailchimp if you want a simple, general tool for newsletters. Both have free plans at 250 contacts, but they bill differently: Klaviyo by active profiles, Mailchimp by contacts.",
    proofLine:
      "I mostly build in Klaviyo, so I'm biased toward it for stores. I've kept the numbers below to what each company publishes, and I've linked every one.",
    published: '2026-10-30',
    updated: '2026-10-30',
    mainTable: {
      caption: 'Klaviyo vs Mailchimp at a glance (US dollars)',
      head: ['', 'Klaviyo', 'Mailchimp'],
      rows: [
        ['Free plan', 'Up to 250 active profiles, 500 sends a month', 'Up to 250 contacts, 500 sends a month (250 a day)'],
        ['Paid plans start at', `About $20 a month for 500 profiles (tracker figure)`, '$13 a month (Essentials), $20 (Standard), for the first 12 months'],
        ['You are billed by', 'Active profiles', 'Contacts'],
        ['After the intro offer', 'No intro offer shown', 'The page does not show the price after month 12'],
      ],
      note: `Sources: [Klaviyo pricing](${KLAVIYO_PRICING}), [Mailchimp pricing](${MAILCHIMP_PRICING}), and the paid Klaviyo figure from [Email Optimize, 10 October 2026](${OPTIMIZE}). Prices are in US dollars and change.`,
    },
    sections: [
      {
        h: 'How do Klaviyo and Mailchimp charge?',
        answer:
          'Klaviyo charges by active profiles. Mailchimp charges by contacts. Both go up as your list grows, and both have a free plan for 250.',
        p: [
          `[Klaviyo's page](${KLAVIYO_PRICING}) counts "active profiles (contacts who may receive marketing emails)". [Mailchimp's page](${MAILCHIMP_PRICING}) says its plans bill by contacts, with a free plan limited to 250 contacts.`,
          "Mailchimp's low starting prices apply for the first 12 months. The page doesn't show what you pay after that, so look at the price you'll pay in month 13 before you commit. (Nothing ruins a good deal like a sequel.)",
        ],
      },
      {
        h: 'Which is cheaper?',
        answer:
          'At the lowest paid tier, Mailchimp looks cheaper on paper: $13 or $20 a month in its first-year offer, versus about $20 for Klaviyo at 500 profiles. But the intro price ends, so compare the real price after year one.',
        p: [
          'The fair way to compare: take your list size, find that tier on both pricing pages, and write down both prices for month 1 and month 13. Then add what you will pay for texts, if you want them.',
          'A cheaper plan you do not use costs more than a pricier plan that makes sales.',
        ],
      },
      {
        h: 'Which is better for an online store?',
        answer:
          "Klaviyo is built around online stores. It connects to store platforms like Shopify and can send emails based on what shoppers do, like leaving a cart.That is why it is the one I set up most often for stores.",
        p: [
          'Mailchimp can work for a store too, especially a small one that mostly sends newsletters. If you want abandoned cart, welcome and post-purchase automations to carry the load, Klaviyo is the tool I would set up first.',
          'Start with this one: [abandoned cart emails, with examples you can copy](/blog/abandoned-cart-emails).',
        ],
      },
      {
        h: 'Which is better for a service business?',
        answer:
          'For a service business with a small list, either works. Choose the one you will actually switch on, and set up a welcome email and a follow-up for people who contact you.',
        p: [
          "A plumber, a tutor or a photographer doesn't need fancy store features. They need a signup box, a welcome email, and a nudge for people who asked a question and went quiet. Most tools can do that.",
          `The [email marketing for small business guide](/blog/email-marketing-for-small-business) shows the three emails to start with, and the Canadian consent rules.`,
        ],
      },
      {
        h: 'Can you switch later?',
        answer:
          'Yes. You can export your contacts from one tool and import them into another. The harder part is rebuilding your automations, so pick carefully and avoid switching every year.',
        after: [
          `Switching tools mid-year is how a "quick afternoon job" turns into a three-week side quest. If you want it done for you, I set up [automated email follow-up](${EMAIL}) with a 90-day money-back guarantee.`,
        ],
      },
    ],
    field: {
      h: 'A 5-minute way to choose',
      answer:
        'Answer three questions: Do you sell products online? Do you want emails to react to what people do? Will you use texts? Three yeses points to Klaviyo. Mostly newsletters points to Mailchimp.',
      p: [
        "If you're torn, start on the free plan of the one that fits best and build a single welcome email. You'll learn more from one live email than from ten comparison tables.",
      ],
    },
    faq: [
      {
        q: 'Is Klaviyo better than Mailchimp?',
        a: 'For online stores that want automations triggered by shopper behaviour, many store owners prefer Klaviyo. For simple newsletters, Mailchimp is often enough. It depends on what you sell and what you will use.',
      },
      {
        q: 'Do Klaviyo and Mailchimp both have free plans?',
        a: `Yes. [Klaviyo's free plan](${KLAVIYO_PRICING}) covers up to 250 active profiles and 500 sends a month. [Mailchimp's free plan](${MAILCHIMP_PRICING}) is limited to 250 contacts, with a monthly send cap of 500.`,
      },
      {
        q: 'Why does Mailchimp list prices for 12 months?',
        a: `Its page shows starting prices "for 12 months" and doesn't show the price afterward, so check what you'd pay once the first year ends. See [Mailchimp's pricing page](${MAILCHIMP_PRICING}).`,
      },
      {
        q: 'Which one is easier for beginners?',
        a: 'The tool matters less than the first email. Start with a welcome email, whichever one you pick, and build from there.',
      },
    ],
    bridge: `Not sure your email setup is catching the people who almost bought? Get a [free website audit](${AUDIT}). I'll show you where visitors slip away and what I'd fix first.`,
    next: 'klaviyo-vs-omnisend',
  },

  {
    // primary: "klaviyo vs omnisend" (20)
    slug: 'klaviyo-vs-omnisend',
    metaTitle: 'Klaviyo vs Omnisend (2026): Prices and Differences',
    metaDescription:
      'Klaviyo vs Omnisend for online stores: free plans, how each one prices your list, and what to compare before you pay for either.',
    h1: 'Klaviyo vs Omnisend: how to compare them fairly',
    quickAnswer:
      "Both are email tools built for online stores, and both have a free plan for 250 contacts. Omnisend lists paid plans from US$11.20 a month on its pricing page. Klaviyo's paid plans start around US$20 a month for 500 profiles, per price trackers. The list sizes behind those prices differ, so compare the same list size on both.",
    proofLine:
      "I build in Klaviyo most often, so I'm not neutral. I've stuck to the numbers each company shows and linked them. One of them doesn't show every number, and I've said so where that happens.",
    published: '2026-10-30',
    updated: '2026-10-30',
    mainTable: {
      caption: 'Klaviyo vs Omnisend plans (US dollars)',
      head: ['', 'Klaviyo', 'Omnisend'],
      rows: [
        ['Free plan', 'Up to 250 active profiles, 500 sends a month', 'Up to 250 contacts, 500 emails a month'],
        ['A paid price shown', 'About $20 a month at 500 profiles (tracker figure)', 'Standard $11.20 a month (up to 500 contacts, 6,000 emails)'],
        ['Next step up', 'About $30 a month at 1,000 profiles (tracker figure)', 'Pro $41.30 a month (2,500 contacts, unlimited emails with fair use)'],
        ['Text messages', 'Billed separately by credit', 'Billed separately as SMS credits'],
      ],
      note: `Sources: [Klaviyo pricing](${KLAVIYO_PRICING}), [Omnisend pricing](${OMNISEND_PRICING}), and Klaviyo's paid figures from [Email Optimize, 10 October 2026](${OPTIMIZE}). Prices are in US dollars and change. Omnisend's page shows these prices with a list-size slider and does not say which list size each price matches, so don't compare them line for line.`,
    },
    sections: [
      {
        h: 'How are the free plans different?',
        answer:
          'They are close. Both cover about 250 contacts and 500 emails a month. The difference shows up after you pass those limits.',
        p: [
          `[Klaviyo's free plan](${KLAVIYO_PRICING}) is up to 250 active profiles and 500 sends. [Omnisend's free plan](${OMNISEND_PRICING}) is 250 contacts and 500 emails a month, plus 500 web push notifications.`,
        ],
      },
      {
        h: 'How does each one price your list?',
        answer:
          'Both price by list size. Klaviyo uses active profiles. Omnisend uses a list-size slider that changes the plan price and the limits.',
        p: [
          "The trap is comparing the first price you see. Omnisend's page shows its prices next to a list-size slider and doesn't say which list size each price matches. Klaviyo's tracker prices are tied to a clear size: about $20 at 500 profiles and about $60 at 2,500.",
          'So set the slider to your own list size, write down the price, and put it next to the Klaviyo number for the same size. Price is only half the picture, because it will not tell you which one earns more for your store.',
        ],
      },
      {
        h: 'What should you compare besides price?',
        answer:
          'Compare the emails that make money: welcome, abandoned cart and post-purchase. Check how each tool connects to your store, how easy it is to build those flows, and what the reports show.',
        items: [
          'Does it connect to your store platform without a developer?',
          'Can you build a cart reminder in under an hour?',
          'Does it record consent so you stay CASL compliant?',
          'Can you see revenue from each email?',
          'What does the plan cost at double your current list?',
        ],
        after: [
          "Test both free plans with one welcome email before you decide. It takes an afternoon and saves you from paying for the wrong tool for a year.",
        ],
      },
      {
        h: 'Which one would I pick?',
        answer:
          "For Shopify stores, I set up Klaviyo most often, mainly because I know it well. If your list is small and your budget is tight, Omnisend is worth a real trial.",
        p: [
          'That is my bias, said out loud. The honest answer is that the best tool is the one with its automations switched on. Read [Klaviyo pricing](/blog/klaviyo-pricing) and [Klaviyo vs Mailchimp](/blog/klaviyo-vs-mailchimp) to see how the costs grow.',
        ],
      },
    ],
    field: {
      h: 'A fair test you can run this week',
      answer:
        'Open a free account on both. Build the same welcome email in each. Time yourself, and note which one felt clearer.',
      p: [
        "Then ask each one what your price would be at your list size today and at twice that size. Write both numbers down. That tiny spreadsheet beats any comparison post, including this one.",
      ],
    },
    faq: [
      {
        q: 'Is Omnisend cheaper than Klaviyo?',
        a: `On the prices each company shows, Omnisend's paid plans start lower (from $11.20 a month on its [pricing page](${OMNISEND_PRICING})). But list sizes differ, so compare the same list size on both.`,
      },
      {
        q: 'Do both have a free plan?',
        a: `Yes. [Klaviyo](${KLAVIYO_PRICING}) and [Omnisend](${OMNISEND_PRICING}) both offer free plans with 500 emails a month and a list limit of 250.`,
      },
      {
        q: 'Which is better for Shopify?',
        a: 'Both connect to Shopify. I most often set up Klaviyo, but you can test both on their free plans and see which feels clearer.',
      },
      {
        q: 'Can I move from one to the other?',
        a: 'Yes. You can export contacts and import them into the new tool. Rebuilding your automations takes longer than moving the list.',
      },
    ],
    bridge: `Want a second opinion on your store's follow-up emails? Get a [free website audit](${AUDIT}). I'll show you where shoppers drop off and what I'd fix first.`,
    next: 'klaviyo-pricing',
  },
]
