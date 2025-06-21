I made a Hypixel bedwars stats tracker website. It uses next.js. So when the user inputs their username, it fetches their stats from the Hypixel API and displays them on the page. The website is designed to be user-friendly and visually appealing, with a clean layout and easy navigation. It currently caches the data in mongodb (I know, not ideal) so every request within 5 minutes will not hit the Hypixel API. Also there is a leaderboards feature that caches for 4 hours (longer because takes multiple requests to the Hypixel API).

So right now I want to make it so the data is cached in
