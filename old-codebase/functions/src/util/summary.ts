import type { BWStatsData } from "./getStats";
import { FRIENDLY_EXTRA_MODE_NAMES, FRIENDLY_MODE_NAMES, FRIENDLY_LB_NAMES, FRIENDLY_STAT_NAMES, LB_ORDER } from "./const";

// export const generateSummary = (data: BWStatsData): string => {
//   const mostPlayedMode = allModesExceptOverallFriendlyNames[Object.entries(data.stats.modes).sort((a, b) => b[1].gamesPlayed - a[1].gamesPlayed)[1][0]];

//   const { fkdr } = data.stats.modes.total;

//   return `With ${data.stats.levelFormatted} stars, ${data.stats.modes.total.wins} wins, and ${data.stats.coinsFormatted} coins, \
// Minecraft player ${data.username} is an ${fkdr > 10 ? "professional" : fkdr > 5 ? "very advanced" : fkdr > 1 ? "advanced" : "improving"} Bedwars player that mainly enjoys ${mostPlayedMode} mode!`;
// };

const { total: _, ...allModesExceptOverallFriendlyNames } = { ...FRIENDLY_MODE_NAMES, ...FRIENDLY_EXTRA_MODE_NAMES };

export const generateSummary = (data: BWStatsData): string => {
  // Extract relevant information from the data object
  const { coinsFormatted, modes, levelFormatted } = data.stats;
  const { fkdr } = modes.total;

  // Determine the Bedwars mode that the player has played the most
  const mostPlayedMode = Object.entries(modes).sort((a, b) => (a[0] === "total" ? 1 : b[0] === "total" ? -1 : b[1].gamesPlayed - a[1].gamesPlayed))[0][0];
  const mostPlayedModeFriendlyName = allModesExceptOverallFriendlyNames[mostPlayedMode];

  // Generate a string summarizing the player's statistics in various Bedwars modes
  const statsInfo = FRIENDLY_STAT_NAMES.map((statGroup) => {
    return Object.entries(statGroup)
      .map(([stat, friendlyName]) => `${friendlyName}: ${modes.total[stat]}`)
      .join(", ");
  }).join(" / ");

  // Generate a string summarizing the number of Bedwars challenges the player has completed
  const numChallenges = data.stats.challenges.length;
  const challengesInfo = numChallenges === 0 ? "" : `This player has completed ${numChallenges} challenges!`;

  // Generate a summary essay with all the information
  return `Minecraft player ${data.username} is an experienced Bedwars player with ${levelFormatted} stars and ${coinsFormatted} coins. With an impressive win/loss ratio of ${fkdr.toFixed(
    2
  )}, they are a formidable opponent in any Bedwars match. ${challengesInfo} Their preferred mode is ${mostPlayedModeFriendlyName}, which they have played ${modes[mostPlayedMode].gamesPlayed} times. 

  In terms of Bedwars leaderboards, they rank highly. Their lifetime stats in Bedwars include ${statsInfo}. 

  Additionally, they have collected a total of ${data.stats.modes.total.resourcesCollected} resources, with ${data.stats.modes.total.itemsPurchased} items purchased, ${
    data.stats.modes.total.bedsBroken
  } beds broken, and ${data.stats.modes.total.bedsLost} beds lost. They have also acquired ${data.stats.modes.total.ironCollected} iron. 

  Overall, this Bedwars player is a force to be reckoned with and has put in a significant amount of time and effort to become one of the best. Their stats and leaderboard rankings are a testament to their skill and dedication to the game. Good luck facing them in the Bedwars arena!`;
};

// eslint-disable-next-line no-unused-vars

export { allModesExceptOverallFriendlyNames };
