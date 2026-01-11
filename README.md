# Hypixel Bedwars Stats Tracker

A modern Next.js web application for tracking Hypixel Bedwars statistics and viewing leaderboards. This project provides players with comprehensive tools to analyze their Minecraft Hypixel Bedwars performance, compare themselves against others on global leaderboards, and explore detailed statistics across all game modes.

## Features

This application offers a powerful suite of features designed to give players deep insights into their Bedwars performance. You can search for any player and instantly access their detailed statistics, which are calculated across every game mode including Solo, Doubles, Triples, and Quad Bedwars, as well as many other variants. The application intelligently caches data to ensure fast load times while keeping information fresh—player statistics are refreshed every 5 minutes, and leaderboards are cached for 4 hours.

The player statistics interface displays comprehensive data with visual organization, making it easy to understand your performance at a glance. You can view a detailed breakdown of your stats organized by game mode, compare your performance across different play styles, and see a natural language summary of your Bedwars achievement in prose form. The application also includes an interactive 3D Minecraft skin viewer that displays your character with smooth animations, adding a personal touch to the stats experience.

Beyond individual player tracking, the application features multiple leaderboard views that let you check where you rank among the top players. You can filter leaderboards by different metrics such as player level, total wins, and final kills, giving you multiple ways to see how you stack up against the competition. The entire interface is fully responsive and works seamlessly across desktop and mobile devices, so you can check your stats wherever you are.

## Tech Stack

This project is built with modern web technologies designed for performance and maintainability. The foundation is **Next.js 15** with **React 19**, providing server-side rendering capabilities and a great developer experience. The styling uses **Tailwind CSS**, which was migrated from Bootstrap to provide a more streamlined and customizable design system. For data caching and fast retrieval, the application relies on **Redis** to store player queries and leaderboard data, ensuring quick response times even with high traffic. Real-time Bedwars data is fetched from the **Hypixel Public API**, and the project uses **Bun** as its package manager for faster installations and execution.

## Pages and Functionality

The application is organized around three main pages that each serve a distinct purpose:

- **Home Page** (`/`): Serves as the entry point where players can search for any username and instantly retrieve their complete Bedwars statistics with a clean, intuitive search interface.
- **Player Statistics Page** (`/user/[username]`): Displays comprehensive player data including stats across all game modes, visual stat breakdowns, a text-based summary of achievements, and a 3D skin viewer that brings the player's Minecraft character to life.
- **Leaderboards Page** (`/leaderboards`): Shows the top players across multiple ranking categories, allowing you to explore different leaderboard views and see where the best players rank.

### User Page Features

The player statistics page is the core of the application and includes several powerful features designed to give you a complete picture of your performance. The page displays comprehensive stat numbers with intuitive icons at the top, giving you a quick overview of your key achievements. Below that, you'll find detailed data tables showing your stats for both your combined total performance and your results in the four main game modes (Solo, Doubles, Triples, and Quad). There's also a separate table breaking down your performance in other Bedwars variants, letting you see how you perform across all available game types.

One unique feature of the player page is the narrative statistics summary, which converts your raw numbers into natural language sentences describing your playstyle and achievements. The application renders this page using server-side rendering with Suspense boundaries to optimize performance, and future improvements will leverage Next.js Partial Pre-Rendering when that feature becomes stable. The visual centerpiece is an interactive React-based skin viewer that displays your Minecraft character in full 3D with smooth animations, creating an engaging and personalized experience.

## File Structure

```
bwstats-next (root)
├── .env
├── .env.development
├── .github
│   └── [...]
├── .gitignore
├── .next
├── .vscode
│   └── settings.json
├── bun.lockb
├── eslint.config.mjs
├── next.config.ts
├── old-codebase
│   ├── [...]
├── package.json
├── postcss.config.mjs
├── public
│   ├── [...]
├── README.md
├── src
│   ├── app
│   │   ├── about
│   │   │   └── page.tsx
│   │   ├── admin
│   │   │   └── page.tsx
│   │   ├── api
│   │   │   ├── admin
│   │   │   │   └── route.ts
│   │   │   └── leaderboards
│   │   │       ├── preview
│   │   │       │   └── route.ts
│   │   │       └── route.ts
│   │   ├── ClientHomePage.tsx
│   │   ├── fonts
│   │   │   ├── fonts.ts
│   │   │   └── minecraft.woff2
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── leaderboards
│   │   │   ├── page.tsx
│   │   │   └── [tab]
│   │   │       └── page.tsx
│   │   ├── page.tsx
│   │   └── user
│   │       └── [username]
│   │           ├── error.tsx
│   │           ├── opengraph-image.tsx
│   │           └── page.tsx
│   ├── components
│   │   ├── Footer.tsx
│   │   ├── LeaderboardPreviewSection.tsx
│   │   ├── ModernFooter.tsx
│   │   ├── ModernNavigation.tsx
│   │   ├── PlayerSkinView.tsx
│   │   ├── ui
│   │   │   ├── alert.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── collapsible.tsx
│   │   │   ├── input.tsx
│   │   │   └── navigation-menu.tsx
│   │   └── UserPageSkeleton.tsx
│   ├── lib
│   │   ├── accessMonitor.ts
│   │   ├── constants.ts
│   │   ├── getLeaderboards.ts
│   │   ├── getStats.ts
│   │   ├── getUserData.ts
│   │   ├── redis.ts
│   │   └── utils.ts
│   ├── middleware.ts
│   └── types
│       ├── bootstrap.d.ts
│       └── index.ts
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json
```

## Migration from Firebase

This project represents a complete rewrite and modernization of the original Firebase Functions + EJS codebase. The original implementation served its purpose but relied on older technologies and architectures that limited scalability and maintainability. The new Next.js-based implementation addresses these limitations and provides a significantly better foundation for future development.

The migration brings several key improvements across the entire application stack. The frontend now uses modern React with server-side rendering capabilities, replacing the EJS templating engine and providing a much better developer experience and more interactive user interface. Performance has been optimized throughout, with smarter caching strategies for both user queries and leaderboard data. The visual design has been completely refreshed with a clean, responsive interface that works beautifully on all devices, replacing the older Bootstrap implementation. Throughout the codebase, comprehensive TypeScript type safety ensures fewer bugs and better developer tools, and error handling has been substantially improved with proper error boundaries, fallback UI states, and meaningful error messages for users.

The old Firebase Functions codebase is preserved in the `old-codebase` directory for reference purposes, but all active development now takes place in the modern Next.js implementation.

## License

This project is not affiliated with Hypixel or Mojang.
