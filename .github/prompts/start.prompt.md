I made a Hypixel bedwars stats tracker website. It uses firebase functions, firebase hosting, and ejs. So when the user inputs their username, it fetches their stats from the Hypixel API and displays them on the page. The website is designed to be user-friendly and visually appealing, with a clean layout and easy navigation. It currently caches the data in mongodb (I know, not ideal) so every request within 5 minutes will not hit the Hypixel API. Also there is a leaderboards feature that caches for 4 hours (longer because takes multiple requests to the Hypixel API).

So this is a pretty old codebase, and I want to migrate it to next.js. To help you, I've already ran `bun create next-app`. I want you to migrate the old codebase to the new one FULLY. If there is any bad practices or unnecessary complexity, feel free to clean it up on the way. I am not just asking you to migrate the codebase, but also to improve it. The new codebase should be clean, modern, and follow best practices. Use bun to install libraries (for example, `bun add react-bootstrap`). Also feel free to delete anything from the bun nextjs template that you don't need. Do not modify anything in the old codebase, because that is for reference; I understand it is not the best codebase, but I want to keep it as a reference.

--- OLD CODEBASE TREE ---
./
└── old-codebase
├── .firebaserc
├── .gitignore
├── firebase.json
├── functions
│ ├── .env
│ ├── .eslintrc.json
│ ├── .gitignore
│ ├── package.json
│ ├── pnpm-lock.yaml
│ ├── src
│ │ ├── app.ts
│ │ ├── db.ts
│ │ ├── index.ts
│ │ ├── models
│ │ │ ├── lbquery.ts
│ │ │ └── userquery.ts
│ │ ├── types.d.ts
│ │ └── util
│ │ ├── arrayChunk.ts
│ │ ├── const.ts
│ │ ├── getLeaderboards.ts
│ │ ├── getStats.ts
│ │ ├── getUser.ts
│ │ ├── isDev.ts
│ │ ├── render.ts
│ │ ├── saveData.ts
│ │ └── summary.ts
│ ├── tsconfig.json
│ └── views
│ ├── ad1.ejs
│ ├── leaderboards.ejs
│ ├── player.ejs
│ └── viewdata1.ejs
├── package.json
├── pnpm-lock.yaml
└── public
├── about.html
├── android-chrome-192x192.png
├── android-chrome-512x512.png
├── apple-touch-icon.png
├── banner.png
├── bgimg
│ ├── 1.jpeg
│ ├── 10.jpeg
│ ├── 11.jpeg
│ ├── 12.jpeg
│ ├── 13.jpeg
│ ├── 14.jpeg
│ ├── 2.jpeg
│ ├── 3.jpeg
│ ├── 4.jpeg
│ ├── 5.jpeg
│ ├── 6.jpeg
│ ├── 7.jpeg
│ ├── 8.jpeg
│ └── 9.jpeg
├── css
│ └── main.css
├── custom-bs-collapse-v1.js
├── favicon-16x16.png
├── favicon-32x32.png
├── favicon.ico
├── favicon.png
├── index.html
├── robots.txt
├── short_bed.png
├── short_bed_256.png
├── short_bed_5.png
├── short_bed_512.png
├── short_bed_old.png
└── site.webmanifest

--- END OLD CODEBASE TREE ---
