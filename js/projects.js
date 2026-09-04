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
        liveUrl: "",
        repoUrl: "https://github.com/bassim-ghaly-14/rotix"
    }
];
