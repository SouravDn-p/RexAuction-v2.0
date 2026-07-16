import type { BlogType } from "../types/shared/blogTypes";

export const BLOG_CATEGORIES = [
  "Auction Guide",
  "Bidding Tips",
  "Seller Tips",
  "Collectibles",
  "Market Trends",
  "Success Stories",
  "Platform Updates",
  "Security & Trust",
];

export const MOCK_BLOGS: BlogType[] = [
  {
    _id: "1",
    title: "How Online Auctions Work: A Beginner's Guide",
    fullContent:
      "Online auctions allow buyers to compete for items by placing bids within a specific time period. The highest bidder at the end of the auction wins the item.\n\nIn this guide, we explain auction rules, reserve prices, bid increments, and how to place bids effectively. Understanding these concepts can help users participate confidently and avoid common mistakes.\n\nWe also discuss real-time bidding systems, automatic bid extensions, and payment procedures after winning an auction.",
    imageUrls: [
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=800",
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800",
    ],
    category: "Auction Guide",
    author: "admin@rexauction.com",
    authorName: "Auction Team",
    authorEmail: "admin@rexauction.com",
    authorBio:
      "The RexAuction editorial team shares insights, tutorials, and updates to help users maximize their auction experience.",
    authorImage: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200",
    featured: true,
    createdAt: "2026-01-10T10:00:00Z",
    updatedAt: "2026-01-10T10:00:00Z",
  },

  {
    _id: "2",
    title: "Top 10 Strategies to Win More Auctions",
    fullContent:
      "Winning auctions isn't always about placing the highest bid early. Experienced bidders use timing, research, and budget management to secure valuable items.\n\nThis article explores sniper bidding, maximum bid limits, competitor analysis, and avoiding emotional bidding wars.\n\nLearn how to identify opportunities, monitor auctions effectively, and increase your chances of winning while staying within budget.",
    imageUrls: [
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
    ],
    category: "Bidding Tips",
    author: "admin@rexauction.com",
    authorName: "Auction Team",
    authorEmail: "admin@rexauction.com",
    authorBio:
      "Experts in online auction management and bidding strategies.",
    authorImage: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200",
    featured: true,
    createdAt: "2026-01-12T09:00:00Z",
    updatedAt: "2026-01-12T09:00:00Z",
  },

  {
    _id: "3",
    title: "How to Create Listings That Attract More Bidders",
    fullContent:
      "A successful auction starts with a compelling listing. Sellers should focus on clear titles, detailed descriptions, and high-quality images.\n\nThis guide explains how to highlight product features, set competitive starting prices, and build trust through transparency.\n\nYou'll also learn how listing duration and category selection impact auction performance.",
    imageUrls: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    ],
    category: "Seller Tips",
    author: "seller-support@rexauction.com",
    authorName: "Seller Success Team",
    authorEmail: "seller-support@rexauction.com",
    authorBio:
      "Helping sellers maximize visibility and revenue on the auction platform.",
    authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    featured: false,
    createdAt: "2026-01-15T08:00:00Z",
    updatedAt: "2026-01-15T08:00:00Z",
  },

  {
    _id: "4",
    title: "Rare Collectibles: What Makes Them Valuable?",
    fullContent:
      "Collectibles are among the most exciting categories in online auctions. Their value is often determined by rarity, condition, demand, and historical significance.\n\nIn this article, we examine trading cards, vintage watches, coins, and memorabilia that frequently attract competitive bidding.\n\nUnderstanding market trends can help both buyers and sellers make informed decisions.",
    imageUrls: [
      "https://images.unsplash.com/photo-1518544889280-7f0f6e91e96f?w=800",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    ],
    category: "Collectibles",
    author: "market-insights@rexauction.com",
    authorName: "Market Insights Team",
    authorEmail: "market-insights@rexauction.com",
    authorBio:
      "Providing auction market analysis and collectible valuation insights.",
    authorImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200",
    featured: true,
    createdAt: "2026-01-18T11:00:00Z",
    updatedAt: "2026-01-18T11:00:00Z",
  },

  {
    _id: "5",
    title: "Avoiding Common Auction Mistakes",
    fullContent:
      "Many new users lose auctions or overspend because they don't have a clear strategy.\n\nCommon mistakes include bidding emotionally, ignoring item descriptions, failing to research market value, and waiting too long to verify payment methods.\n\nThis guide highlights practical steps to help you participate safely and confidently.",
    imageUrls: [
      "https://images.unsplash.com/photo-1556742031-c6961e8560b0?w=800",
      "https://images.unsplash.com/photo-1554224154-22dec7ec8818?w=800",
    ],
    category: "Auction Guide",
    author: "support@rexauction.com",
    authorName: "Customer Success Team",
    authorEmail: "support@rexauction.com",
    authorBio:
      "Dedicated to helping users enjoy a safe and successful auction experience.",
    authorImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200",
    featured: false,
    createdAt: "2026-01-20T07:30:00Z",
    updatedAt: "2026-01-20T07:30:00Z",
  },

  {
    _id: "6",
    title: "Platform Update: New Real-Time Bidding Features",
    fullContent:
      "We're excited to introduce a faster and more reliable bidding experience.\n\nOur latest update includes real-time bid notifications, live bidder activity feeds, automatic auction extensions, and enhanced mobile performance.\n\nThese improvements ensure fair competition and a seamless user experience across all devices.",
    imageUrls: [
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800",
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800",
    ],
    category: "Platform Updates",
    author: "product@rexauction.com",
    authorName: "Product Team",
    authorEmail: "product@rexauction.com",
    authorBio:
      "Building innovative auction experiences for buyers and sellers worldwide.",
    authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    featured: true,
    createdAt: "2026-01-22T12:00:00Z",
    updatedAt: "2026-01-22T12:00:00Z",
  },
];

// export const MOCK_BLOGS: BlogType[] = [
//   {
//     _id: "1",
//     title: "Getting Started with React and TypeScript",
//     fullContent:
//       "TypeScript supercharges your React development by adding static types. In this post, we walk through setting up a new project, defining component props with interfaces, and leveraging generics for hooks like useState and useReducer.\n\nBy the end you will have a solid foundation for building large-scale, maintainable React applications. We cover everything from basic type annotations to advanced patterns like discriminated unions and mapped types.\n\nOne of the biggest wins with TypeScript is catching bugs at compile time rather than runtime. You get immediate feedback in your editor when you pass the wrong prop type or forget a required field.\n\nWe also explore how to type third-party libraries, write custom type guards, and use utility types like Partial, Pick, and Omit to keep your code DRY.",
//     imageUrls: [
//       "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
//       "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
//     ],
//     category: "Technology",
//     author: "sarah.chen@example.com",
//     authorName: "Sarah Chen",
//     authorEmail: "sarah.chen@example.com",
//     authorBio:
//       "Sarah is a senior frontend engineer with 8 years of experience building large-scale React applications. She is passionate about TypeScript, accessibility, and developer tooling.",
//     authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
//     featured: true,
//     createdAt: "2024-11-10T10:00:00Z",
//     updatedAt: "2024-11-12T08:30:00Z",
//   },
//   {
//     _id: "2",
//     title: "The Art of Minimalist Design",
//     fullContent:
//       "Minimalism in design is not about removing elements — it is about removing the unnecessary. Every pixel should have a purpose. We explore white space, typographic hierarchy, and the psychology behind restraint.\n\nGreat minimalist design is actually harder than maximalist design because you have nowhere to hide. Every decision is visible and deliberate. The grid, the font, the margin — they all carry weight.\n\nWe look at iconic examples from Dieter Rams, Apple, and Swiss International Style and extract principles you can apply to your own work today.\n\nKey takeaways include: using a single accent color, limiting your type scale to three sizes, and embracing generous padding to let content breathe.",
//     imageUrls: [
//       "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800",
//       "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
//     ],
//     category: "Design",
//     author: "james.miller@example.com",
//     authorName: "James Miller",
//     authorEmail: "james.miller@example.com",
//     authorBio:
//       "James is a product designer and visual artist based in Berlin. He has designed products used by millions and teaches design thinking workshops across Europe.",
//     authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
//     featured: false,
//     createdAt: "2024-10-28T14:00:00Z",
//     updatedAt: "2024-10-29T09:00:00Z",
//   },
//   {
//     _id: "3",
//     title: "Mastering Tailwind CSS in 2025",
//     fullContent:
//       "Tailwind's utility-first approach has changed how we write CSS forever. This guide covers custom themes, dark mode strategies, component extraction with @apply, and the new v4 features that ship by default.\n\nWe start with the mental model shift from semantic CSS to utility classes. Yes, your HTML will look busier — but your stylesheet will be smaller, your design system more consistent, and your iteration speed dramatically faster.\n\nIn the advanced section we dive into the JIT compiler internals, writing Tailwind plugins, and integrating with design tokens exported from Figma using Style Dictionary.\n\nFinally we look at performance: purging unused styles, critical CSS extraction, and measuring real-world bundle size impact.",
//     imageUrls: [
//       "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
//       "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800",
//     ],
//     category: "Technology",
//     author: "priya.nair@example.com",
//     authorName: "Priya Nair",
//     authorEmail: "priya.nair@example.com",
//     authorBio:
//       "Priya is a full-stack developer and open-source contributor who maintains several popular Tailwind CSS plugins. She writes about CSS architecture and web performance.",
//     authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
//     featured: true,
//     createdAt: "2024-10-15T11:00:00Z",
//     updatedAt: "2024-10-16T07:45:00Z",
//   },
//   {
//     _id: "4",
//     title: "Building a Sustainable Morning Routine",
//     fullContent:
//       "Productivity starts before you open your laptop. We break down habit stacking, the two-minute rule, and how journaling can reduce decision fatigue and sharpen creative focus throughout the day.\n\nThe research is clear: willpower is a finite resource. By automating your morning with consistent habits, you preserve cognitive bandwidth for the work that actually matters.\n\nWe share a sample routine that takes 90 minutes and covers movement, nutrition, deep work priming, and mindfulness — without feeling like a chore.\n\nThe key is starting small. Pick one habit, anchor it to something you already do, and expand from there. Trying to overhaul everything at once is the fastest path to failure.",
//     imageUrls: [
//       "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
//       "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
//     ],
//     category: "Lifestyle",
//     author: "tom.bradley@example.com",
//     authorName: "Tom Bradley",
//     authorEmail: "tom.bradley@example.com",
//     authorBio:
//       "Tom is a productivity coach and author of 'The Intentional Day'. He helps founders and creatives design systems that support deep work and sustainable output.",
//     authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
//     featured: false,
//     createdAt: "2024-09-20T07:00:00Z",
//     updatedAt: "2024-09-21T10:00:00Z",
//   },
//   {
//     _id: "5",
//     title: "Deep Dive into Next.js App Router",
//     fullContent:
//       "The App Router introduced server components, nested layouts, and streaming — fundamentally changing how we think about data fetching in Next.js applications.\n\nThis post walks through real-world patterns for caching strategies, loading states, error boundaries, and route groups. We compare the old Pages Router approach to the new mental model and explain when each makes sense.\n\nWe build a complete example: a dashboard with parallel routes, intercepting routes for modals, and server actions for form submissions — all without a single useState for server data.\n\nPerformance benchmarks show significant improvements in Time to First Byte and Largest Contentful Paint when using server components correctly. We break down why and how to measure it yourself.",
//     imageUrls: [
//       "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800",
//       "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
//     ],
//     category: "Technology",
//     author: "alex.wu@example.com",
//     authorName: "Alex Wu",
//     authorEmail: "alex.wu@example.com",
//     authorBio:
//       "Alex is a Next.js core contributor and engineering lead at a Series B startup. He specializes in web performance, edge computing, and developer experience.",
//     authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
//     featured: true,
//     createdAt: "2024-09-05T09:30:00Z",
//     updatedAt: "2024-09-06T11:00:00Z",
//   },
//   {
//     _id: "6",
//     title: "Photography Composition Masterclass",
//     fullContent:
//       "Great photos are made, not taken. This masterclass walks through the foundational rules of composition — rule of thirds, leading lines, framing, negative space — and when to break each one for creative effect.\n\nWe analyze iconic photographs from Henri Cartier-Bresson, Ansel Adams, and contemporary Instagram photographers to extract repeatable principles.\n\nThe second half focuses on light: golden hour, harsh midday shadows, overcast as a giant softbox, and how to use reflectors and diffusers without expensive gear.\n\nFinally we cover post-processing philosophy. The best edit is the one that serves the image's intent, not the one that shows off the most sliders.",
//     imageUrls: [
//       "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800",
//       "https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=800",
//     ],
//     category: "Photography",
//     author: "maya.patel@example.com",
//     authorName: "Maya Patel",
//     authorEmail: "maya.patel@example.com",
//     authorBio:
//       "Maya is an award-winning photographer and educator whose work has appeared in National Geographic and TIME. She teaches workshops on street and landscape photography worldwide.",
//     authorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
//     featured: false,
//     createdAt: "2024-08-18T15:00:00Z",
//     updatedAt: "2024-08-19T12:00:00Z",
//   },
//   {
//     _id: "7",
//     title: "The Science of Better Sleep",
//     fullContent:
//       "Sleep is not downtime — it is when your brain consolidates memories, clears metabolic waste, and repairs tissue. Yet most people treat it as a negotiable luxury.\n\nThis post synthesizes the latest neuroscience research into actionable advice. We cover circadian rhythm mechanics, the role of adenosine and melatonin, and why blue light really does disrupt sleep onset.\n\nPractical strategies include temperature manipulation (cooler rooms genuinely help), consistent wake times, the 90-minute sleep cycle framework, and how alcohol sabotages REM sleep even in small quantities.\n\nWe also address common sleep disorders, when to see a doctor, and the evidence (or lack thereof) behind popular supplements like magnesium, L-theanine, and ashwagandha.",
//     imageUrls: [
//       "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800",
//       "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
//     ],
//     category: "Health",
//     author: "dr.nina.ross@example.com",
//     authorName: "Dr. Nina Ross",
//     authorEmail: "dr.nina.ross@example.com",
//     authorBio:
//       "Dr. Nina Ross is a sleep researcher and clinical psychologist at Stanford Sleep Medicine Center. She has published over 40 peer-reviewed papers on sleep disorders and cognitive performance.",
//     authorImage: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200",
//     featured: false,
//     createdAt: "2024-08-01T08:00:00Z",
//     updatedAt: "2024-08-02T10:00:00Z",
//   },
//   {
//     _id: "8",
//     title: "Introduction to Machine Learning for Developers",
//     fullContent:
//       "Machine learning does not have to be intimidating. If you can write a for loop and understand basic statistics, you have everything you need to start building real models today.\n\nWe begin with the three categories of ML: supervised, unsupervised, and reinforcement learning, with intuitive examples of each. Then we set up a Python environment with scikit-learn and build a classifier from scratch in under 50 lines of code.\n\nFrom there we move to neural networks: what a perceptron actually does mathematically, how backpropagation works without scary calculus, and how to use PyTorch for a simple image classifier.\n\nThe final section covers practical concerns developers often overlook: data quality, train/validation/test splits, overfitting, and how to evaluate model performance honestly.",
//     imageUrls: [
//       "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800",
//       "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
//     ],
//     category: "Technology",
//     author: "leon.zhang@example.com",
//     authorName: "Leon Zhang",
//     authorEmail: "leon.zhang@example.com",
//     authorBio:
//       "Leon is an ML engineer at a top AI research lab and an adjunct professor at UC Berkeley. He is passionate about making machine learning concepts accessible to software engineers.",
//     authorImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200",
//     featured: true,
//     createdAt: "2024-07-22T13:00:00Z",
//     updatedAt: "2024-07-23T09:30:00Z",
//   },
// ];