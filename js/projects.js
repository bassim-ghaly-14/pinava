// Portfolio project dataset
const myProjects = [
    {
        id: 1,
        slug: "pineup",
        title: "PineUp Network",
        tagline: "Full-featured social networking platform",
        description:
            "A modern full-featured social networking platform with real-time interactions, infinite feeds, nested comments, social graphs, JWT authentication, and a scalable feature-based architecture built with Next.js and TypeScript.",
        highlights: [
            "Real-time interactions via WebSocket",
            "Infinite feeds and nested comments",
            "JWT authentication and social graphs"
        ],
        caseStudy: {
            challenge:
                "A social platform combines many interacting features — auth, feeds, nested comments, and real-time updates — so the hard part is not any single screen, but keeping server state consistent across all of them as the app grows.",
            approach:
                "The app is structured as feature-oriented modules, each owning its components, hooks, and API layer. TanStack Query acts as the single source of truth for server state, with cache invalidation cascading between related features.",
            decisions: [
                "Chose TanStack Query over manual effect-based fetching so caching, background refetching, and invalidation stay predictable instead of scattered across components.",
                "Adopted a feature-oriented folder structure so each social feature — feed, comments, profile — can evolve without touching unrelated code.",
                "Used WebSocket events to reconcile real-time interactions directly with the Query cache rather than duplicating state in local stores."
            ]
        },
        techs: [
            "Next.js",
            "React 19",
            "TypeScript",
            "TanStack Query",
            "MUI",
            "Tailwind CSS",
            "Axios",
            "WebSocket"
        ],
        category: "fullstack",
        featured: true,
        favicon: "assets/projects/pineup/favicon.svg",
        liveUrl: "https://pineup.vercel.app/",
        repoUrl: "https://github.com/bassim-ghaly-14/pineup"
    },
    {
        id: 2,
        slug: "trado",
        title: "TRADO Store",
        tagline: "Production-oriented e-commerce storefront",
        description:
            "A production-oriented e-commerce storefront featuring a complete shopping lifecycle, JWT authentication, protected routes, Stripe checkout, and a scalable server-state architecture powered by TanStack Query.",
        highlights: [
            "Complete shopping lifecycle with Stripe",
            "Protected routes and JWT auth",
            "Server-state architecture via TanStack Query"
        ],
        caseStudy: {
            challenge:
                "E-commerce interfaces fail when cart, session, and checkout state drift out of sync. The challenge was keeping the full shopping lifecycle consistent — browsing to Stripe payment — while keeping the codebase maintainable.",
            approach:
                "The shopping flow is modeled as explicit, protected route stages. Server state is centralized in TanStack Query with per-resource cache keys, and checkout/payment logic lives in a dedicated module so the payment flow stays isolated and testable.",
            decisions: [
                "Guarded authenticated routes at the router level so protected pages are unreachable by URL manipulation, not just hidden in the UI.",
                "Used TanStack Query cache invalidation to keep cart, session, and order data consistent after checkout instead of manual state juggling.",
                "Managed checkout validation with Formik so field errors are declared per-field rather than handled with ad-hoc conditionals."
            ]
        },
        techs: [
            "React 19",
            "Vite",
            "TanStack Query",
            "React Router",
            "Tailwind CSS",
            "Axios",
            "Formik",
            "Stripe"
        ],
        category: "frontend",
        featured: true,
        favicon: "assets/projects/trado/favicon.svg",
        liveUrl: "https://trado-green.vercel.app/",
        repoUrl: "https://github.com/bassim-ghaly-14/route-course"
    },
    {
        id: 3,
        slug: "sky-weather",
        title: "SKY Weather",
        tagline: "Dependency-free weather application",
        description:
            "A dependency-free weather application with geolocation, accessible city autocomplete, persistent location preferences, and a secure serverless API proxy for real-time weather and 5-day forecasts.",
        highlights: [
            "Geolocation and city autocomplete",
            "Persistent location preferences",
            "Serverless API proxy integration"
        ],
        caseStudy: {
            challenge:
                "Weather data requires an API key, but a dependency-free static site has nowhere to keep secrets. The challenge was exposing live weather and 5-day forecasts without shipping credentials or pulling in a framework.",
            approach:
                "The client stays pure HTML, CSS, and ES modules, while the OpenWeatherMap call is moved behind a small Vercel serverless function that injects the key at runtime — the browser only ever talks to the proxy.",
            decisions: [
                "Proxied the weather API through a serverless function so the API key never reaches the browser bundle.",
                "Persisted the last selected location in localStorage so the app opens on relevant data without requesting geolocation on every visit.",
                "Built the entire UI with zero runtime dependencies to keep the app fast, portable, and fully auditable."
            ]
        },
        techs: [
            "HTML5",
            "CSS3",
            "JavaScript",
            "ES Modules",
            "OpenWeatherMap API",
            "Vercel Serverless"
        ],
        category: "frontend",
        featured: true,
        favicon: "assets/projects/sky-weather/favicon.svg",
        liveUrl: "https://sky-pple.vercel.app/",
        repoUrl: "https://github.com/bassim-ghaly-14/sky"
    },
    {
        id: 4,
        slug: "pine-notes",
        title: "Pine Notes",
        tagline: "Privacy-first dependency-free notes application",
        description:
            "A privacy-first, dependency-free notes application built with Vanilla JavaScript, featuring local-first data storage, Markdown editing, task management, command palette, keyboard-first workflows, automated data migrations, backups, and automated testing.",
        highlights: [
            "Local-first data storage with Markdown",
            "Command palette and keyboard workflows",
            "Automated migrations, backups, and testing"
        ],
        caseStudy: {
            challenge:
                "Notes applications live or die on data trust. Without a backend, the challenge was making localStorage feel as reliable as a database — schema changes, corrupt data, and accidental loss all had to be handled defensively.",
            approach:
                "The app is local-first by design: a versioned storage schema with an automated migration pipeline, exportable backups, and a command palette that operates directly on local data so every workflow works offline and stays private.",
            decisions: [
                "Versioned the storage schema and automated migrations so new features can change the data shape without breaking existing notes.",
                "Wrapped every read and write in defensive parsing and validation so corrupt or tampered data degrades gracefully instead of crashing the app.",
                "Added automated tests around migrations and core logic to make local persistence safe to refactor."
            ]
        },
        techs: [
            "HTML5",
            "CSS3",
            "JavaScript",
            "ES Modules",
            "Local Storage",
            "Markdown",
            "Node.js"
        ],
        category: "frontend",
        featured: true,
        favicon: "assets/projects/pine-notes/favicon.svg",
        liveUrl: "https://pine-notes.vercel.app/",
        repoUrl: "https://github.com/bassim-ghaly-14/pine-notes"
    },
    {
        id: 5,
        slug: "rotix",
        title: "ROTIX Puzzle",
        tagline: "Cyber-fluid pipeline puzzle game",
        description:
            "A dependency-free cyber-fluid puzzle game where players rotate pipeline nodes to route two independent energy streams into a shared reactor, solve 30 handcrafted levels, and manage a rising pressure system.",
        highlights: [
            "30 handcrafted levels with a built-in graph solver",
            "Dual-channel power propagation and pressure system",
            "English/Arabic localization with full RTL support"
        ],
        caseStudy: {
            challenge:
                "A puzzle game needs rules the player can trust and levels that are actually solvable. With two independent energy streams and a rising pressure system, it was easy to accidentally create impossible — or trivial — levels.",
            approach:
                "The grid is modeled as a graph and a built-in solver propagates both energy channels simultaneously, so every one of the 30 handcrafted levels is verified solvable. Player progression persists across sessions.",
            decisions: [
                "Solved each level's grid as a graph with dual-channel propagation, guaranteeing no shipped level is impossible.",
                "Kept game logic deterministic and separated from rendering so rotations and pressure resolve identically on every run.",
                "Shipped English/Arabic localization with full RTL layout support from the start rather than retrofitting it later."
            ]
        },
        techs: [
            "HTML5",
            "CSS3",
            "JavaScript",
            "ES Modules",
            "Web Audio API",
            "Vibration API",
            "Local Storage",
            "i18n"
        ],
        category: "game",
        featured: false,
        favicon: "assets/projects/rotix/favicon.svg",
        liveUrl: "https://rotix-game.vercel.app/",
        repoUrl: "https://github.com/bassim-ghaly-14/rotix"
    },
    {
        id: 6,
        slug: "wardyan",
        title: "WARDYAN Store",
        tagline: "Lightweight flower-shop storefront",
        description:
            "A lightweight flower-shop storefront built with HTML, CSS, and vanilla JavaScript, featuring product browsing, product details, a persistent shopping cart, coupon handling, theme switching, and a simulated checkout flow.",
        highlights: [
            "Persistent cart, coupons, and theme preferences",
            "Product details modal with reusable cart and checkout logic",
            "Responsive storefront with simulated order confirmation"
        ],
        caseStudy: {
            challenge:
                "A small storefront still needs a coherent shopping lifecycle: product discovery, product details, cart management, discounts, and checkout should work together without introducing framework or backend complexity.",
            approach:
                "The application uses native ES modules with a centralized store for cart, coupon, and theme state. Product data remains local, while dedicated modules handle the product grid, cart drawer, coupons, checkout, theme switching, and shared UI behavior.",
            decisions: [
                "Used a centralized pub/sub store with localStorage persistence so cart, coupon, and theme state remain consistent across UI updates and page reloads.",
                "Reused the same cart and checkout logic from both product cards and the product details modal instead of duplicating shopping-flow behavior.",
                "Kept the storefront dependency-free and backend-free, using a simulated checkout flow to demonstrate the complete client-side shopping experience without introducing unnecessary infrastructure."
            ]
        },
        techs: [
            "HTML5",
            "CSS3",
            "JavaScript",
            "ES Modules",
            "Local Storage",
            "Font Awesome",
            "Cloudinary"
        ],
        category: "frontend",
        featured: false,
        favicon: "assets/projects/wardyan/favicon.svg",
        liveUrl: "https://wardyan.vercel.app/",
        repoUrl: "https://github.com/bassim-ghaly-14/Wardyan"
    },
    {
    id: 7,
    slug: "krava",
    title: "KRAVA Store",
    tagline: "Dependency-free streetwear e-commerce storefront",
    description:
        "A lightweight streetwear e-commerce storefront built with HTML, CSS, and vanilla JavaScript, featuring product variants, live stock awareness, persistent cart state, coupon discounts, URL-synced product selections, and a simulated checkout flow.",
    highlights: [
        "Color and size variants with live stock awareness",
        "Persistent cart with variant-based line items and coupons",
        "URL-synced product selections and simulated checkout"
    ],
    caseStudy: {
        challenge:
            "An e-commerce storefront needs more than a product grid: variants, stock, cart state, discounts, and checkout all have to remain consistent while keeping the implementation lightweight and dependency-free.",
        approach:
            "KRAVA uses native ES modules with a centralized pub/sub store that manages cart and coupon state, persists mutations to localStorage, and keeps shared UI synchronized across multiple pages. Product variants remain part of a static catalog, while dedicated modules handle products, cart, checkout, coupons, theme, and the lookbook slider.",
        decisions: [
            "Modeled cart line items by product, color, and size so different variants remain independent while adding the same variant again merges its quantity.",
            "Used a centralized store with pub/sub subscriptions and localStorage persistence to keep the cart badge, cart page, and other shared UI synchronized across pages.",
            "Synced product color and size selections to the URL with URLSearchParams and history.replaceState, making selected variants shareable and bookmarkable without adding a backend.",
            "Used the Web Crypto API to generate order IDs instead of predictable sequential identifiers during the simulated checkout flow."
        ]
    },
    techs: [
        "HTML5",
        "CSS3",
        "JavaScript",
        "ES Modules",
        "Local Storage",
        "Web Crypto API",
        "Font Awesome",
        "Cloudinary"
    ],
    category: "frontend",
    featured: false,
    favicon: "assets/projects/krava/favicon.svg",
    liveUrl: "https://krava-store.vercel.app/",
    repoUrl: "https://github.com/bassim-ghaly-14/KRAVA-store"
    },
    {
    id: 8,
    slug: "pineapple-tv",
    title: "Pineapple TV",
    tagline: "Movie and TV discovery & personal tracking platform",
    description:
        "A movie and TV discovery platform built with Next.js and TypeScript, featuring TMDB-powered discovery, rich media details, personal watchlists and ratings, episode-level progress tracking, runtime API validation, and a server-side architecture that keeps external API credentials secure.",
    highlights: [
        "TMDB-powered discovery, search, filters, and rich media details",
        "Personal watchlists, ratings, watched history, and episode progress",
        "Server-side API boundary with Zod validation and normalized domain models"
    ],
    caseStudy: {
        challenge:
            "A media application depends on a third-party API with inconsistent response shapes, sensitive credentials, and a large amount of client-side state. The challenge was keeping external API complexity away from the UI while making discovery and personal tracking feel like one cohesive product.",
        approach:
            "Pineapple TV establishes a strict boundary between TMDB and the application domain. Server-side fetchers handle authentication and caching, Zod validates every response, adapters normalize external payloads into stable domain models, and repository-based persistence keeps personal state isolated from the UI.",
        decisions: [
            "Kept the TMDB API token strictly server-side and exposed only controlled Route Handlers for client-initiated requests.",
            "Used Zod schemas and adapters at the external API boundary so UI components consume stable domain models instead of raw TMDB response shapes.",
            "Built personal state on top of repository classes and a replaceable StorageAdapter, keeping watchlists, ratings, watched history, and episode progress independent from localStorage implementation details.",
            "Used endpoint-specific caching and route-level revalidation to reduce unnecessary TMDB requests while keeping discovery and detail pages responsive."
        ]
    },
    techs: [
        "Next.js 14",
        "React 18",
        "TypeScript",
        "Tailwind CSS",
        "Zod",
        "TanStack Query",
        "TMDB API",
        "Vitest"
    ],
    category: "fullstack",
    featured: false,
    favicon: "assets/projects/pineapple-tv/favicon.svg",
    liveUrl: "https://pineapple-tv.vercel.app/",
    repoUrl: "https://github.com/bassim-ghaly-14/pineapple-tv"
    },
];
