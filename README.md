# Hypixel Bedwars Stats Tracker

A modern Next.js web application for tracking Hypixel Bedwars statistics and viewing leaderboards.

## Features

- **Player Statistics**: View detailed Bedwars stats for any player including kills, deaths, wins, losses, and more across all game modes
- **Leaderboards**: Check out the top players by level, wins, and final kills
- **Caching**: Data is cached for 5 minutes (player stats) and 4 hours (leaderboards) for fast loading
- **Responsive Design**: Modern, mobile-friendly interface using Bootstrap
- **Real-time Data**: Fetches live data from the Hypixel API

## Tech Stack

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS (Migrated from Bootstrap)
- **Database**: Redis for caching user queries and leaderboards
- **API**: Hypixel Public API
- **Package Manager**: Bun

## Pages

- `/`: Home page with player search
- `/user/[username]`: Player statistics page
- `/leaderboards`: Leaderboards page

## Features

- **Search**: Search for players by username

### User Page

- Includes comprehensive stat numbers with icons at the top
- A table of stats for the total + 4 main game modes
- A table for the other game modes
- A text summary of the player's stats in sentences
- React skinviewer component to display the player's Minecraft skin in 3d with animations
- Beautiful
- Server side rendering with suspense (will switch to partial prerendering when stable)

- **Leaderboards**: View top players by level, wins, and final kills
- **Responsive Design**: Works on desktop and mobile devices

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

This project is a complete migration from the old Firebase Functions + EJS codebase to modern Next.js with the following improvements:

- **Modern React**: Server-side rendering and client-side interactivity
- **Better Performance**: Optimized caching and data fetching
- **Improved UI**: Clean, responsive design with Bootstrap
- **Type Safety**: Full TypeScript implementation
- **Better Error Handling**: Comprehensive error states and user feedback

## License

This project is not affiliated with Hypixel or Mojang.
