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
- **Styling**: Bootstrap 5 + Tailwind CSS
- **Database**: MongoDB with Mongoose
- **API**: Hypixel Public API
- **Package Manager**: Bun

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in your environment variables:
   ```bash
   MONGODB_URI=your_mongodb_connection_string
   HYPIXEL_API_KEY=your_hypixel_api_key
   ```
3. Install dependencies:
   ```bash
   bun install
   ```
4. Run the development server:
   ```bash
   bun dev
   ```

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `HYPIXEL_API_KEY`: Your Hypixel API key (get from https://developer.hypixel.net/)
- `NODE_ENV`: Set to `development` for development mode

## API Endpoints

- `GET /api/user/[username]`: Get player statistics
- `GET /api/leaderboards`: Get current leaderboards

## Pages

- `/`: Home page with player search
- `/user/[username]`: Player statistics page
- `/leaderboards`: Leaderboards page

## Migration from Firebase

This project is a complete migration from the old Firebase Functions + EJS codebase to modern Next.js with the following improvements:

- **Modern React**: Server-side rendering and client-side interactivity
- **Better Performance**: Optimized caching and data fetching
- **Improved UI**: Clean, responsive design with Bootstrap
- **Type Safety**: Full TypeScript implementation
- **Better Error Handling**: Comprehensive error states and user feedback

## License

This project is not affiliated with Hypixel or Mojang.
