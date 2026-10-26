// Batch 2 blog posts (Oct 26, 2026). Same locked template and rules as lib/blog-posts.ts.
// Voice: Kaleel's, light and funny in the body. Quick answers, tables, numbers, FAQ and CTAs stay straight.
// Keyword targets from Semrush Canada database, October 2026 (volume / KD).
import type { Post } from './blog-posts'

const AUDIT = '/audit'
const EMAIL = '/services/email-marketing-automation'
const BAYMARD = 'https://baymard.com/lists/cart-abandonment-rate'
const CRTC = 'https://crtc.gc.ca/eng/com500/guide.htm'
const GOOGLE_POLICY = 'https://support.google.com/contributionpolicy/answer/7400114'

export const MORE_POSTS: Post[] = [
  {
    // primary: "email marketing for small business" (90, KD 31)
    // cluster: "casl compliance" (480, KD 32), "email list" (260, KD 42), "email marketing tips" (140, KD 45),
    // "email marketing small business" (70, KD 32), "how to start email marketing" (30), "casl email marketing" (20)
    slug: 'email-marketing-for-small-business',
    metaTitle: 'Email Marketing for Small Business: Where to Start (2026)',
    metaDescription:
      'Email marketing for small business, made simple: how to build a list, the 3 emails to automate first, and how to stay CASL compliant in Canada.',
    h1: 'Email marketing for small business: where to start',
    quickAnswer:
      'Start email marketing by collecting emails with clear permission, then automate three emails: a welcome email for new subscribers, a follow-up for people who asked about your service, and a check-in for past customers. In Canada, every marketing email must follow CASL: get consent, say who you are, and include an unsubscribe link.',
    proofLine:
      "I set up automated email follow-up for small businesses and online stores, mostly in Klaviyo. Below is the starter setup I'd build if you had zero emails today, plus the Canadian rules that trip people up.",
    published: '2026-10-26',
    updated: '2026-10-26',
    mainTable: {
      caption: 'The 3 emails to automate first',
      head: ['Email', 'When it sends', 'Its job'],
      rows: [
        ['Welcome email', 'Right after someone joins your list', 'Say thanks, deliver what you promised, set expectations'],
        ['Inquiry follow-up', "A day or two after someone contacts you and goes quiet", 'Answer common doubts and invite the next step'],
        ['Past customer check-in', 'A few months after a purchase', 'Bring them back, or ask for a review'],
      ],
      note: 'These are starting points, not rules. Adjust the timing to how long your customers usually take to decide.',
    },
    sections: [
      {
        h: 'Is email marketing worth it for a small business?',
        answer:
          "Yes, if your customers don't always buy on their first visit, which is most customers. Email lets you follow up for very little money, and you own the list. Social media followers belong to the platform. Your email list belongs to you.",
        p: [
          "Meet Kevin. Kevin filled out your contact form in March, got one polite reply, and then life happened. Kevin wasn't saying no. Kevin was making dinner. Without follow-up, Kevin buys from whoever emails him next. (Sorry, Kevin. We'll come back for you.)",
          "Social apps change their rules whenever they feel like it. Your email list doesn't care about algorithms, and it doesn't vanish when an app does. That's the whole pitch.",
        ],
      },
      {
        h: 'How do you start an email list from zero?',
        answer:
          "Start with the people who already know you: customers, people who contact you, and website visitors. Give them a clear reason to join, like a useful guide or checklist, and say exactly what they'll get and how often. Never add people without their permission.",
        items: [
          'A signup box on your website, with one clear reason to join',
          'A separate, unticked checkbox at checkout or on your contact form',
          'Something useful in return: a checklist, a price guide, a how-to',
          'A link to your signup page in your social media bios',
        ],
        after: [
          "What not to do: copy every business card from the networking event into your email tool. I know. The stack of cards is right there on your desk, judging you. CASL only treats a card as permission in narrow cases, and a person who never asked for your emails is a person who clicks \"spam\". Ask first.",
        ],
      },
      {
        h: 'What should a small business send in its emails?',
        answer:
          'Send emails that help before they sell. A good rhythm is one helpful email for every promotional one: a tip, an answer to a common question, a behind-the-scenes look, then an offer. Keep each email to one idea and one button.',
        items: [
          'The question you answer ten times a week',
          'A quick win they can do today',
          'What happens when they work with you, step by step',
          'A real customer story, with their permission',
          'An offer, with a real deadline if it has one',
        ],
        after: [
          "If every email you send is a sale, your list learns one thing: ignore you. Nobody wants the friend who only calls when he's moving apartments.",
          `Not sure your website is collecting emails at all? A [free website audit](${AUDIT}) checks your signup, your forms and your follow-up in one go.`,
        ],
      },
      {
        h: 'Is your email marketing CASL compliant?',
        answer:
          "Canada's Anti-Spam Legislation (CASL) says every commercial email needs three things: consent, clear identification of who sent it, and a working unsubscribe link. According to the CRTC, unsubscribe requests must be honoured within 10 business days.",
        table: {
          caption: 'CASL consent in plain words (CRTC guidance)',
          head: ['Type of consent', 'How you get it', 'How long it lasts'],
          rows: [
            ['Express consent', 'They clearly said yes, like ticking an unticked box', 'Until they unsubscribe'],
            ['Implied, from a purchase', 'They bought from you', '2 years from the last purchase'],
            ['Implied, from an inquiry', 'They asked you a question', '6 months from the inquiry'],
          ],
          note: `Source: [CRTC guidance on CASL and implied consent](${CRTC}). This is general information, not legal advice.`,
        },
        after: [
          "The fines aren't a joke, even though I'm about to make one. CASL penalties can reach [$10 million per violation for a business](https://www.insideprivacy.com/international/compu-finder-subjected-to-1-1m-penalty-first-fine-under-canadas-new-anti-spam-law/). That's a lot of money to spend emailing your cousin's friend's dentist.",
          'The easy fix: ask for express consent whenever you can, and keep a record of when and how each person joined. Good email tools record this for you.',
        ],
      },
      {
        h: 'Which email marketing tool should a small business use?',
        answer:
          'Pick the tool that fits what you sell. Online stores usually do best with a tool that connects to the store, like Klaviyo for Shopify. A service business can start with any tool that has an affordable plan, simple automations and a signup form.',
        p: [
          "Prices change often, so check each tool's own pricing page before you choose. The tool matters less than whether you actually turn the automations on. A cheap tool with a working welcome email beats an expensive one with nothing switched on.",
          "Plenty of email accounts end up like gym memberships: paid every month, opened once, deeply motivating in January.",
          'Running an online store? Your first automation should be a cart reminder. Here are [abandoned cart emails with examples](/blog/abandoned-cart-emails) you can copy.',
        ],
      },
      {
        h: 'What are the best email marketing tips for small businesses?',
        answer:
          'Write like a person, keep one idea per email, use a subject line that says what is inside, send on a steady schedule, and watch replies and clicks, not just opens. Automate the emails that should go out every time, so they never depend on your memory.',
        items: [
          "**Write the way you talk.** If you wouldn't say it out loud, don't send it.",
          '**One idea, one button.** Two buttons means two decisions, and people pick neither.',
          '**Say what is inside.** "3 ways to cut your heating bill" beats "Newsletter #14".',
          '**Send from a real name.** People open emails from people.',
          '**Clean your list.** Remove people who never open, so your emails keep landing in inboxes.',
          '**Automate the repeat emails.** Welcome, follow-up and check-in should run on their own.',
        ],
        after: [
          'Kevin, by the way, would have received three helpful emails by now. Kevin would have booked.',
          `That last tip is where most of the money is. If you'd rather not build it yourself, I set up [automated email follow-up](${EMAIL}) for small businesses and online stores, with a 90-day money-back guarantee.`,
        ],
      },
    ],
    field: {
      h: 'What I found on 10 Vaughan business websites',
      answer:
        "When I reviewed 10 Vaughan Chamber of Commerce member homepages in October 2026, none scored full marks for staying in touch with visitors who weren't ready to buy. Most offered only a contact form or a phone number, and none said when they'd reply.",
      p: [
        "That's a lot of Kevins. Each of those businesses pays, in time, ads or networking, to get people to its website, then lets the ones who aren't ready walk away with nothing. A signup box and one welcome email would catch some of them.",
      ],
    },
    faq: [
      {
        q: 'How much does email marketing cost for a small business?',
        a: "Many email tools have free or low-cost plans for small lists, and the price grows with your list. Idea Marketing's 2026 guide puts email marketing tools at about $20 to $300 a month. Setup help is usually a separate, one-time cost.",
      },
      {
        q: 'How often should a small business send emails?',
        a: 'Send on a schedule you can keep. For most small businesses, once or twice a month is a good start, plus automated emails like welcome and follow-up that send on their own.',
      },
      {
        q: 'Can I email people who gave me their business card?',
        a: 'Sometimes, but be careful. CASL allows implied consent in some cases, such as when someone gives you their card and your email relates to their work. The safest route is to ask them directly if they want your emails.',
      },
      {
        q: 'What should my first marketing email be?',
        a: 'A welcome email. Thank them for joining, give them what you promised, tell them what to expect and how often, and invite one simple next step.',
      },
    ],
    bridge: `Want to know if your website is catching emails at all? Get a [free website audit](${AUDIT}). I'll check your forms, signup and follow-up, and tell you what I'd fix first.`,
    next: 'abandoned-cart-emails',
  },
  {
    // primary: "abandoned cart email" (50, KD 47)
    // cluster: "cart abandonment" (50, KD 0), "abandoned cart email examples" (30, KD 0), "abandoned cart emails" (30, KD 0),
    // "shopify abandoned cart email" (20), "abandoned cart recovery" (20)
    slug: 'abandoned-cart-emails',
    metaTitle: 'Abandoned Cart Emails: How They Work, With 3 Examples',
    metaDescription:
      'How abandoned cart emails work, when to send them, and 3 example emails you can copy. Plus why about 70% of carts are abandoned and what to fix first.',
    h1: 'Abandoned cart emails: how they work, with examples',
    quickAnswer:
      "An abandoned cart email is an automatic reminder sent to a shopper who added items to their cart but didn't buy. A simple series is three emails: one within a few hours, one the next day, and a last one two or three days later. About 70% of online carts are abandoned, according to Baymard Institute.",
    proofLine:
      "I build abandoned cart emails and other automated flows for online stores, mostly in Klaviyo on Shopify. Here's how I'd set one up, with three example emails you can copy and make your own.",
    published: '2026-10-26',
    updated: '2026-10-26',
    mainTable: {
      caption: 'A simple 3-email abandoned cart series',
      head: ['Email', 'When to send', 'What it says'],
      rows: [
        ['1. Reminder', '1 to 4 hours after they leave', 'You left something behind, with a photo and a link back to the cart'],
        ['2. Help', 'About 24 hours later', 'Answers the doubt that stopped them: shipping, returns or sizing'],
        ['3. Last nudge', '2 to 3 days later', 'A final reminder, plus an offer only if you choose to use one'],
      ],
      note: "Timing is a starting point. Test it against your own store's data.",
    },
    sections: [
      {
        h: 'Why do shoppers abandon their carts?',
        answer:
          "The top reason is surprise costs. In Baymard Institute's research, 40% of shoppers who abandoned a cart said extra costs like shipping, tax or fees were too high. Slow delivery, not trusting the site with card details, and being forced to create an account came next.",
        table: {
          caption: 'Top reasons shoppers abandon carts',
          head: ['Reason', 'Share of shoppers'],
          rows: [
            ['Extra costs too high (shipping, tax, fees)', '40%'],
            ['Delivery too slow', '20%'],
            ["Didn't trust the site with card details", '19%'],
            ['Had to create an account', '18%'],
            ['Checkout too long or complicated', '17%'],
            ['Website errors or crashes', '17%'],
          ],
          note: `Source: [Baymard Institute cart abandonment research](${BAYMARD}), average of 50 studies. Excludes shoppers who were just browsing.`,
        },
        after: [
          'Think of every abandoned cart as a shopping cart left in the middle of a parking lot. Somebody wanted that stuff enough to push it around. Then something got in the way, and they drove off. An abandoned cart email is you, politely, wheeling the cart back over to their car.',
        ],
      },
      {
        h: 'Do abandoned cart emails actually work?',
        answer:
          "Yes, because they reach people who already showed they wanted to buy. A shopper who added items to a cart is far warmer than someone who never visited. The email doesn't have to convince them from scratch. It only has to remove whatever stopped them.",
        p: [
          'The catch: an email cannot fix a broken checkout. If surprise costs are the top reason people leave, and your shipping price only shows up on the last step, the email just sends them back to the same surprise. (Surprise! Still $19 shipping.)',
          `That's why I look at the store first. A [free website audit](${AUDIT}) checks the checkout steps where shoppers bail, before you spend time on emails.`,
        ],
      },
      {
        h: 'Abandoned cart email examples you can copy',
        answer:
          'These three examples follow the series above. Copy them, change the words so they sound like you, and add a photo of the product and a button back to the cart in each one.',
        items: [
          '**Email 1. Subject: You left something good behind.** "Hey {first name}, your cart is still here, exactly how you left it. No pressure. If you got pulled away, it\'s one tap to pick up where you left off." Button: Back to my cart',
          '**Email 2. Subject: Quick question about your order.** "Was anything unclear? Here\'s the short version: shipping is [your shipping], returns are [your policy], and if you\'re between sizes, [your sizing tip]. Reply to this email and a real person will answer." Button: Finish my order',
          '**Email 3. Subject: Last call on your cart.** "We\'ll stop bugging you after this one, promise. Your items are still here, but we can\'t hold them forever. [Optional: here\'s 10% off if you finish today.]" Button: Complete my order',
        ],
        after: [
          'Notice what is missing: guilt. No crying emoji. No "our hearts are broken." You\'re a store, not an ex.',
        ],
      },
      {
        h: 'When should you send abandoned cart emails?',
        answer:
          'Send the first email within a few hours, while the shopper still remembers the cart. Send the second about a day later and the last one two or three days after that. Stop the series the moment they buy, so nobody gets reminded about something they already paid for.',
        p: [
          'That last part matters more than it sounds. Nothing says "we\'re paying attention" like asking someone to finish an order that is already on a truck to their house.',
        ],
      },
      {
        h: 'Should you offer a discount in an abandoned cart email?',
        answer:
          'Not always. A discount can win back price-sensitive shoppers, but if every abandoned cart gets one, regular shoppers learn to leave carts on purpose. Try the series without a discount first, and add one only to the last email if your margins allow it.',
        p: [
          'Train your customers, or they will train you. Give a coupon to every abandoned cart and you will soon have a list full of professional cart-abandoners with a side hustle in coupons.',
        ],
      },
      {
        h: 'How do you set up abandoned cart emails on Shopify?',
        answer:
          'Shopify includes a basic abandoned checkout email you can turn on in its settings. Tools like Klaviyo add more control: a series of several emails, product images, and rules that skip people who already bought. Either way, test it yourself with a real cart before you trust it.',
        p: [
          "Testing sounds boring. It is boring. It's also how you find out your \"last call\" email goes out after the order is already delivered.",
          `If you'd rather have it built, tested and tracked for you, that's part of my [email follow-up service](${EMAIL}), with a 90-day money-back guarantee.`,
        ],
      },
    ],
    field: {
      h: 'What I check on a store before writing any emails',
      answer:
        "Before I write a single email, I add something to the cart and try to buy it on my phone. I check when the shipping cost first shows up, whether I'm forced to make an account, and how many steps checkout takes. Those match three of the top reasons in Baymard's list.",
      items: [
        'Shipping cost shown on the product page or in the cart, not only at the last step',
        'Guest checkout allowed, so nobody has to make an account',
        'The return policy one click away from the cart',
        'Payment logos and a secure checkout note visible',
        'Buttons big enough for thumbs on a phone',
      ],
      after: ['Fix those first. Then the emails have a fair shot.'],
    },
    faq: [
      {
        q: 'What makes a good abandoned cart email?',
        a: 'A good abandoned cart email is short, shows the product the shopper left, has one clear button back to the cart, and answers the doubt that stopped them, like shipping or returns.',
      },
      {
        q: 'How many abandoned cart emails should I send?',
        a: 'Two or three is a good starting point. More than that tends to annoy shoppers more than it helps. Stop the series as soon as they buy.',
      },
      {
        q: 'What is the average cart abandonment rate?',
        a: 'Baymard Institute puts the average online shopping cart abandonment rate at about 70%, based on 50 studies.',
      },
      {
        q: 'Are abandoned cart emails allowed in Canada?',
        a: 'They can be, but consent matters. CASL requires permission to send commercial emails, so make sure shoppers agreed to hear from you, for example with a clear signup checkbox at checkout. See [CASL in plain words](/blog/email-marketing-for-small-business). This is general information, not legal advice.',
      },
    ],
    bridge: `Losing shoppers at checkout? Start with a [free website audit](${AUDIT}). I'll show you where your store loses people and what I'd fix first.`,
    next: 'email-marketing-for-small-business',
  },
  {
    // primary: "wix vs squarespace" (590, KD 27)
    // cluster: "wix vs wordpress" (260, KD 33), "shopify vs squarespace" (140, KD 26), "shopify vs wix" (90, KD 32),
    // "wordpress vs shopify" (50, KD 19)
    slug: 'wix-vs-squarespace-vs-shopify-vs-wordpress',
    metaTitle: 'Wix vs Squarespace vs Shopify vs WordPress (2026 Guide)',
    metaDescription:
      'Wix vs Squarespace vs Shopify vs WordPress: which is best for your small business? A plain comparison of ease, selling, upkeep and switching later.',
    h1: 'Wix vs Squarespace vs Shopify vs WordPress: which should you use?',
    quickAnswer:
      "Choose Shopify if selling products is the main job. Choose Squarespace for a polished service site with little setup, Wix if you want drag-and-drop freedom, and WordPress if you want full control and don't mind more upkeep. For most small service businesses, the platform matters less than what the site asks visitors to do.",
    proofLine:
      "I build online stores on Shopify and custom sites on Next.js, so I'm not selling you any of these four. Here's how they compare for a small business, in plain words.",
    published: '2026-10-26',
    updated: '2026-10-26',
    mainTable: {
      caption: 'Wix vs Squarespace vs Shopify vs WordPress at a glance',
      head: ['Feature', 'Wix', 'Squarespace', 'Shopify', 'WordPress'],
      rows: [
        ['Best for', 'Service sites, DIY design', 'Polished service sites', 'Online stores', 'Full control, content-heavy sites'],
        ['Ease of use', 'Easy', 'Easy', 'Easy for stores', 'Takes more learning'],
        ['Selling products', 'Yes, smaller stores', 'Yes, smaller stores', 'Built for it', 'With a plugin like WooCommerce'],
        ['Hosting', 'Included', 'Included', 'Included', 'You arrange it'],
        ['Who handles updates', 'Wix', 'Squarespace', 'Shopify', 'You'],
        ['Moving away later', 'Hard, you rebuild', 'Limited export', 'Possible, with work', 'Easiest'],
      ],
      note: "Plan prices change often, so compare on each platform's own page: [Wix](https://www.wix.com/plans), [Squarespace](https://www.squarespace.com/pricing), [Shopify Canada](https://www.shopify.com/ca/pricing), [WordPress.com](https://wordpress.com/pricing/).",
    },
    sections: [
      {
        h: 'Wix vs Squarespace: which is better?',
        answer:
          'Wix is better if you want to drag things anywhere on the page and add lots of apps. Squarespace is better if you want a clean, consistent design without fiddling. Both include hosting and support, both can sell a few products, and both are hard to leave later.',
        p: [
          'Wix is the friend who lets you rearrange all the furniture. Squarespace is the friend whose apartment already looks great and gets a little nervous when you move the lamp. Neither is wrong. It depends on whether you enjoy moving lamps.',
          "One thing to know before you start: you can't pack up a Wix site and move it to another platform. If you switch later, you rebuild. Squarespace lets you export some content, but not the design.",
        ],
      },
      {
        h: 'Wix vs WordPress: what is the difference?',
        answer:
          "Wix is an all-in-one builder, so hosting, security and updates are handled for you. WordPress is free software you install on your own hosting. That gives you full control and thousands of plugins, but you're responsible for updates, security and fixes.",
        p: [
          'Wix is renting a furnished apartment. WordPress is owning a house: you can knock down any wall you like, and you also get to deal with the roof. Personally. At 11 p.m.',
          'WordPress.com is a hosted version that handles some of this for you. When people say "WordPress", they usually mean the self-hosted kind from WordPress.org.',
        ],
      },
      {
        h: 'Shopify vs Squarespace for selling online',
        answer:
          'Shopify is the stronger choice if selling products is the main job, especially as you add products, inventory and sales channels. Squarespace works for a service business that also sells a few things. Shopify charges a monthly plan plus payment fees, and many features come from paid apps.',
        p: [
          "Squarespace with a shop is a café that sells mugs at the counter. Shopify is the mug factory. If you're mostly selling coffee, you don't need the factory.",
          `Already on one of these and not getting sales? The platform is rarely the problem. A [free website audit](${AUDIT}) shows what's actually stopping people.`,
        ],
      },
      {
        h: 'Shopify vs Wix: which is better for an online store?',
        answer:
          'Shopify is built for online stores first. Wix is built for websites first and adds a store on top. For a handful of products, Wix is fine. For a growing catalogue, lots of orders, or selling across several channels, Shopify is the safer long-term choice.',
        p: ['Picking Wix for a big store is like buying a minivan to start a moving company. It works for the first few jobs. Then you buy a truck.'],
      },
      {
        h: 'WordPress vs Shopify: which should you pick?',
        answer:
          "WordPress with WooCommerce gives you more control and can cost less in platform fees, but you manage hosting, updates and security. Shopify costs more each month and handles all of that for you. If you don't want to be your store's IT department, choose Shopify.",
        p: [
          'Some people love being the IT department. Those people have usually never been woken up by a plugin update on a long weekend.',
        ],
      },
      {
        h: 'Which platform is best for a small service business?',
        answer:
          'For most small service businesses in Canada, any of the four can work. Pick the one you or your designer can update easily, then spend your energy on what the site says and what it asks visitors to do. A clear offer and one main button do more for leads than the platform does.',
        p: [
          `That's how I plan every site: the goal first, the platform second. You can see how on my [Vaughan web design page](/services/web-design-vaughan). For build prices, see [how much a website costs in Canada](/blog/how-much-does-a-website-cost-in-canada).`,
        ],
      },
    ],
    field: {
      h: 'Why I build on Shopify and Next.js',
      answer:
        "I've worked on CamAutoPro's Shopify store, and I built my own store, PosterGenius, on Next.js. Shopify handles payments and inventory well. Next.js gives fast, custom pages without a pile of plugins to keep updated.",
      p: [
        "That's not a knock on the others. It's what I can support best over the long run. The right answer for you depends on who will update the site after launch, and that person should get a vote. (If that person is you at 11 p.m., you get two votes.)",
      ],
    },
    faq: [
      {
        q: 'Which is cheaper, Wix or Squarespace?',
        a: "It depends on the plan, and prices change often. Both have several paid plans, and Wix also has a free plan that shows Wix branding. Compare current prices on each company's pricing page.",
      },
      {
        q: 'Can I switch from Wix to WordPress later?',
        a: "Yes, but you rebuild the site. Wix doesn't let you export your site to another platform, so you copy the content over and redo the design.",
      },
      {
        q: 'Is WordPress free?',
        a: 'The WordPress software is free. You still pay for hosting and a domain, and often for a premium theme or plugins.',
      },
      {
        q: 'Is Shopify good for a service business?',
        a: 'Usually not as the main website. Shopify is built for selling products. A service business is often better served by a regular website with a booking or quote form.',
      },
    ],
    bridge: `Not sure if your platform is holding you back? Get a [free website audit](${AUDIT}). I'll tell you if it's the platform or the page, and what I'd fix first.`,
    next: 'how-much-does-a-website-cost-in-canada',
  },
  {
    // primary: "google review link" (480, KD 49) + "how to get google reviews" (90, KD 53)
    // cluster: "how to get more google reviews" (40, KD 0), "how to ask for reviews" (10), "respond to negative reviews" (10)
    slug: 'how-to-get-google-reviews',
    metaTitle: 'How to Get Google Reviews (and Find Your Review Link)',
    metaDescription:
      'How to get more Google reviews the honest way: find your Google review link, when and how to ask, what to say, and which Google rules to never break.',
    h1: 'How to get more Google reviews',
    quickAnswer:
      "To get more Google reviews, copy your review link from your Google Business Profile (click Ask for reviews), then send it to every customer right after the job with a short, personal message. Make it one tap. Don't pay for reviews, don't offer discounts for them, and don't ask only happy customers. Google bans all three.",
    proofLine:
      "I'm building my own Google reviews from scratch right now, so this is the exact system I'm using, kept inside Google's rules.",
    published: '2026-10-26',
    updated: '2026-10-26',
    mainTable: {
      caption: 'Asking for Google reviews: do this, not that',
      head: ['Do this', 'Not this'],
      rows: [
        ['Ask every customer', 'Ask only the happy ones'],
        ['Say thanks', 'Offer a discount, gift or payment for a review'],
        ['Send your link right after the job', 'Send a link weeks later with no context'],
        ['Ask once, then send one friendly reminder', 'Chase people every week'],
        ['Reply to every review, good and bad', 'Argue with an unhappy reviewer in public'],
      ],
      note: `The first two rows come from Google's [prohibited and restricted content policy](${GOOGLE_POLICY}), which bans incentivised reviews and selectively asking for positive ones. The rest is good practice.`,
    },
    sections: [
      {
        h: 'How do I find my Google review link?',
        answer:
          'Open your Google Business Profile while signed in, click Ask for reviews, and copy the short link it gives you. That link opens the review box for your business directly. Save it somewhere you can paste it fast: your phone notes, your email signature and your invoices.',
        ordered: true,
        items: [
          'Search your business name on Google while signed in, or open Business Profile Manager',
          'Click Ask for reviews',
          'Copy the link',
          'Open it on your phone to test it',
        ],
        after: [
          "Testing your own link and watching the stars pop up is weirdly emotional. Resist the urge to leave yourself five stars. It breaks Google's conflict-of-interest rule, and also, come on.",
        ],
      },
      {
        h: 'When should you ask for a review?',
        answer:
          "Ask right when the customer is happiest: when the job is done, the order arrives, or they say thank you. The good experience is fresh, and the ask feels natural. Three weeks later, they're thinking about something else.",
        p: [
          'Timing is everything. Asking for a review three weeks later is like asking someone to rate a sandwich they ate last month. They remember it was fine. They do not remember the pickles.',
        ],
      },
      {
        h: 'What should you say when you ask for a review?',
        answer:
          'Keep it short, personal and easy. Thank them by name, mention the specific job, paste the link, and tell them it takes about a minute. One message, one link, no pressure.',
        items: [
          '**Text message:** "Hi {name}, thanks again for trusting me with {job}. If you have a minute, a quick Google review would really help a small business like mine: {link}. Either way, I appreciate you!"',
          '**Email subject:** "Quick favour, {name}?" Then the same short message, with the link as a button.',
        ],
        after: [
          "That's it. No four-paragraph essay, no begging, no ALL CAPS. You're asking a favour, not sending a ransom note.",
          `Reviews only work if visitors can see them near your main button. A [free website audit](${AUDIT}) checks whether your site shows proof where people decide.`,
        ],
      },
      {
        h: 'Can you offer an incentive for Google reviews?',
        answer:
          "No. Google's policy bans reviews that are paid for, and bans offering incentives such as payment, discounts, or free goods and services in exchange for reviews. It also bans selectively asking only happy customers for reviews. Content that breaks these rules can be removed.",
        p: [
          'I know. A free coffee for a review seems harmless. Google disagrees, and in this metaphor Google owns the coffee shop.',
        ],
      },
      {
        h: 'How do you get more reviews without being annoying?',
        answer:
          'Build the ask into things you already do. Put your review link on invoices, in your email signature and in thank-you messages, and add a QR code to business cards or receipts. Ask every customer once, send one reminder a few days later, then let it go.',
        items: [
          'A line at the bottom of every invoice',
          'Your email signature',
          'A thank-you text right after the job',
          'A QR code on your business card or receipt',
          'One reminder a few days later, and that is all',
        ],
        after: [
          'One reminder is polite. Three reminders is a hostage situation.',
          `Want it to happen without you remembering? A review request can be part of an [automated email follow-up](${EMAIL}) setup, so every finished job gets the ask.`,
        ],
      },
      {
        h: 'How should you reply to Google reviews?',
        answer:
          'Reply to every review. Thank good reviewers by name and mention the job. For a bad review, reply calmly, own anything that went wrong, and offer to fix it offline. Future customers read your replies too, and a calm one can win more trust than the review loses.',
        p: [
          "Never reply to a bad review in the first five minutes. Go for a walk. Write the angry version, delete it, then write the calm one. Your future customers are reading over your shoulder.",
        ],
      },
    ],
    field: {
      h: 'What I found on 10 Vaughan business websites',
      answer:
        "When I reviewed 10 Vaughan Chamber of Commerce member homepages in October 2026, only 2 scored full marks for proof. Several showed logos or awards but no named customer reviews, and one site's only testimonial was from 2015.",
      p: [
        'A review from 2015 tells a visitor one thing: something nice happened in 2015. Recent reviews tell people you are open, busy and still good at what you do. A steady few each month beats a big pile from years ago.',
        'See how all 10 sites scored in my [website checklist](/blog/website-conversion-checklist-small-business).',
      ],
    },
    faq: [
      {
        q: 'How do I get a link for Google reviews?',
        a: 'In your Google Business Profile, click Ask for reviews and copy the link. Anyone who opens it goes straight to your review box.',
      },
      {
        q: 'Can I pay for Google reviews?',
        a: "No. Google's policy bans paid reviews, and reviews given in exchange for discounts, free products or other incentives.",
      },
      {
        q: 'Can I delete a bad Google review?',
        a: "You can't delete a review just because it's negative. You can report a review that breaks Google's rules, like spam or a fake review, from your Business Profile. Otherwise, reply calmly and professionally.",
      },
      {
        q: 'How many Google reviews do I need?',
        a: 'There is no magic number. Aim for a steady flow of recent reviews and reply to each one. Recent reviews show people your business is active.',
      },
    ],
    bridge: `Want to know if your website shows enough proof to win the click? Get a [free website audit](${AUDIT}). I'll show you where trust is missing and what I'd fix first.`,
    next: 'email-marketing-for-small-business',
  },
]
