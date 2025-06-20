export type PlayerUser = {
  username: string;
  uuid: string;
};

export type BWStatsData = {
  success: boolean;
  username: string;
  cached: boolean;
  uuid: string;
  hypixelId: string;
  time: Date;
  stats: {
    level: number;
    coins: number;
    levelFormatted: string;
    coinsFormatted: string;
    modes: {
      [key: string]: {
        gamesPlayed: number;
        kills: number;
        deaths: number;
        finalKills: number;
        finalDeaths: number;
        wins: number;
        losses: number;
        winstreak: number;
        itemsPurchased: number;
        bedsBroken: number;
        bedsLost: number;
        ironCollected: number;
        goldCollected: number;
        diamondsCollected: number;
        emeraldsCollected: number;
        resourcesCollected: number;
        kdr: number;
        fkdr: number;
        wlr: number;
        bblr: number;
        resourcesCollected1: number;
      };
    };
    challenges: string[];
  };
  raw_bwstats?: Record<string, unknown>;
};

export type BWLeaderboardsData = {
  cached: boolean;
  time: Date;
  stats: {
    [key: string]: {
      uuid: string;
      username: string;
      level: number;
      levelFormatted: string;
      totalWins: number;
      totalFinals: number;
      totalFinalsFormatted: string;
    }[];
  };
};

export type Challenge = {
  name: string;
  rules: string[];
  reward: string;
  n: number;
};
