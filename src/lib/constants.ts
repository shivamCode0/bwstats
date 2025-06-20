export const FRIENDLY_MODE_NAMES = {
  total: "Overall",
  eight_one: "Solo",
  eight_two: "Doubles",
  four_three: "3v3v3v3",
  four_four: "4v4v4v4",
};

export const FRIENDLY_EXTRA_MODE_NAMES = {
  two_four: "4v4",
  eight_one_rush: "Solo Rush",
  eight_one_ultimate: "Solo Ultimate",
  eight_two_lucky: "Doubles Lucky",
  eight_two_armed: "Doubles Armed",
  eight_two_rush: "Doubles Rush",
  eight_two_swap: "Doubles Swap",
  eight_two_ultimate: "Doubles Ultimate",
  eight_two_voidless: "Doubles Voidless",
  four_four_lucky: "4v4v4v4 Lucky",
  four_four_armed: "4v4v4v4 Armed",
  four_four_rush: "4v4v4v4 Rush",
  four_four_swap: "4v4v4v4 Swap",
  four_four_ultimate: "4v4v4v4 Ultimate",
  four_four_voidless: "4v4v4v4 Voidless",
  castle: "Castle",
  tourney_bedwars4s_0: "Tourney 4v4v4v4",
  tourney_bedwars_two_four_0: "Tourney 4v4",
};

export const FRIENDLY_STAT_NAMES = [
  {
    gamesPlayed: "Games Played",
    wins: "Wins",
    losses: "Losses",
    wlr: "Win/Loss Ratio",
  },
  {
    kills: "Kills",
    deaths: "Deaths",
    kdr: "K/D Ratio (KDR)",
    finalKills: "Final Kills",
    finalDeaths: "Final Deaths",
    fkdr: "Final K/D Ratio (FKDR)",
  },
  {
    winstreak: "Winstreak",
    itemsPurchased: "Items Purchased",
    bedsBroken: "Beds Broken",
    bedsLost: "Beds Lost",
    bblr: "Beds B/L Ratio (BBLR)",
  },
  {
    ironCollected: "Iron Collected",
    goldCollected: "Gold Collected",
    diamondsCollected: "Diamonds Collected",
    emeraldsCollected: "Emeralds Collected",
    resourcesCollected: "Total Resources Collected",
  },
];

export const FRIENDLY_LB_NAMES = {
  finalKills: "Lifetime Final Kills - All Modes",
  level: "BW Level",
  wins: "Lifetime Wins - All Modes",
};

export const LB_ORDER = ["level", "wins", "finalKills"];

export const CHALLENGES = {
  no_team_upgrades: {
    name: "Renegade",
    rules: ["Team upgrades and traps are disabled", "You cannot pick up diamonds"],
    reward: "Cat Death Cry",
    n: 0,
  },
  no_utilities: {
    name: "Warmonger",
    rules: ["You cannot purchase nor use any utilities to aid you in battle."],
    reward: "Warrior Shopkeeper Skin",
    n: 1,
  },
  selfish: {
    name: "Selfish",
    rules: ["You are too selfish to drop any items to other players", "Your team chest and enderchest are locked though"],
    reward: "Bite Projectile Trail",
    n: 2,
  },
  slow_generator: {
    name: "Minimum Wage",
    rules: ["Your island resource generator is 2x slower"],
    reward: "It's Raining Gold Final Kill Effect",
    n: 3,
  },
  assassin: {
    name: "Assassin",
    rules: [
      "You can only break the bed of your assigned target",
      "No other beds can be broken until you eliminate your target's entire team",
      "After successfully eliminating your target team, a new target will be assigned",
    ],
    reward: "Assassin Island Topper",
    n: 4,
  },
  reset_armor: {
    name: "Regular Shopper",
    rules: ["Any purchased armor upgrade will be removed upon death", "Any purchased tool upgrade will be removed upon death"],
    reward: "Shopping Cart Island Topper",
    n: 5,
  },
  invisible_shop: {
    name: "Invisible Shop",
    rules: ["Every item in the Item Shop and Team Upgrades is randomized and hidden", "The locations of each item will remain the same throughout the game"],
    reward: "Invisible Villager Island Topper",
    n: 6,
  },
  collector: {
    name: "Collector",
    rules: ["Collect all wool colors and return them to your shop keeper", "You must win the game after all team members return all wool colors"],
    reward: "Collector's Chest Island Topper",
    n: 7,
  },
};
