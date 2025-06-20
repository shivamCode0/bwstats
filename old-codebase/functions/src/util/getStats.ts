import axios from "axios";
import UserQuery from "./../models/userquery";

// import { saveData } from "./saveData";

/**
 * Gets Hypixel Bedwars Stats
 * @param usernameOrUUID ex. `shivamCode` or `d14028a8-6162-4385-be62-d728ef34e961`
 */
export async function getStats({ uuid, username }: PlayerUser) {
  let key = process.env.HYPIXEL_API_KEY;
  console.log(`Getting stats for ${username}`);

  let hypixelTimeStart = Date.now();
  let v2 = await axios.get("https://api.hypixel.net/player", { params: { uuid, key } }).catch((e) => {
    if (e.response.data.throttle) throw new Error("The Hypixel API key is being rate-limited");
    else if (e.response.data.cause == "Invalid API key") throw new Error("Invalid API Key");
    else throw new Error("This player did not ever join Hypixel.");
  });
  console.log(`Got Hypixel Data after ${(Date.now() - hypixelTimeStart) / 1000}s`);
  console.log(`Hypixel API Rate Limit: ${v2.headers["ratelimit-remaining"]}/${v2.headers["ratelimit-limit"]} remaining, resets in ${v2.headers["ratelimit-reset"]}s`);

  let json2: any = v2.data;

  let isDev = process.env.NODE_ENV || process.env.FUNCTIONS_EMULATOR;

  // if (isDev) saveData(json2, "stats", uuid);

  if (!json2 || json2.player == null) throw new Error("This player did not ever join Hypixel.");

  let bwStats = json2.player.stats && json2.player.stats.Bedwars;
  if (!bwStats || !json2.player.achievements) throw new Error("This player has never played Bedwars.");

  const MODE_NAMES = {
    eight_one: "eight_one_",
    eight_two: "eight_two_",
    four_three: "four_three_",
    four_four: "four_four_",
    total: "",
  };
  const EXTRA_MODE_NAMES = Object.fromEntries(
    [
      "two_four",
      "eight_one_rush",
      "eight_one_ultimate",
      "eight_two_armed",
      "eight_two_lucky",
      "eight_two_rush",
      "eight_two_ultimate",
      "eight_two_voidless",
      "four_four_lucky",
      "four_four_armed",
      "four_four_ultimate",
      "four_four_voidless",
      "castle",
      // "tourney_bedwars_two_four_0",
      // "tourney_bedwars4s_1",
    ].map((v) => [v, `${v}_`])
  );
  let modes = Object.entries({ ...MODE_NAMES, ...EXTRA_MODE_NAMES }).reduce<{ [k: string]: { [k: string]: any } }>((ac, [cv, mode]) => {
    let mS = Object.fromEntries(
      Object.entries({
        gamesPlayed: "games_played_bedwars",
        kills: "kills_bedwars",
        deaths: "deaths_bedwars",
        finalKills: "final_kills_bedwars",
        finalDeaths: "final_deaths_bedwars",
        // fallKills: "fall_kills_bedwars",
        // fallDeaths: "fall_deaths_bedwars",
        // fallFinalKills: "fall_final_kills_bedwars",
        // fallFinalDeaths: "fall_final_deaths_bedwars",
        wins: "wins_bedwars",
        losses: "losses_bedwars",
        winstreak: "winstreak",
        itemsPurchased: "_items_purchased_bedwars",
        bedsBroken: "beds_broken_bedwars",
        bedsLost: "beds_lost_bedwars",
        ironCollected: "iron_resources_collected_bedwars",
        goldCollected: "gold_resources_collected_bedwars",
        diamondsCollected: "diamond_resources_collected_bedwars",
        emeraldsCollected: "emerald_resources_collected_bedwars",
        resourcesCollected: "resources_collected_bedwars",
        // resourcesCollected1: "resources_collected_bedwars",
      }).map((e) => [e[0], bwStats[`${mode}${e[1]}`] || 0])
    );
    let d = 10 ** 2;
    return {
      ...ac,
      [cv]: {
        ...mS,
        kdr: Math.round(d * (mS.kills / mS.deaths)) / d,
        fkdr: Math.round(d * (mS.finalKills / mS.finalDeaths)) / d,
        wlr: Math.round(d * (mS.wins / mS.losses)) / d,
        bblr: Math.round(d * (mS.bedsBroken / mS.bedsLost)) / d,
        resourcesCollected1: ["iron", "gold", "diamonds", "emeralds"].reduce((ac, cv) => ac + mS[`${cv}Collected`], 0),
        // collectedResources: {
        //   ...Object.fromEntries(["iron", "gold", "diamond", "emerald"].map((e) => [e, bwStats[`${mode}${e}_resources_collected_bedwars`]])),
        //   total: bwStats[`${mode}resources_collected_bedwars`],
        // },
      },
    };
  }, {});

  let level = Number(json2.player.achievements.bedwars_level);
  let coins = bwStats.coins || 0;

  let challenges = Object.entries(bwStats)
    .filter(([k, v]) => k.startsWith("bw_challenge_") && v)
    .map(([k, v]) => k.replace("bw_challenge_", ""));

  let json3 = {
    // bwStats,
    username,
    cached: false,
    uuid,
    hypixelId: json2.player._id,
    time: new Date(),
    stats: {
      level,
      coins,
      levelFormatted: `${level.toLocaleString("en")} ${level < 1000 ? "✫" : level < 2000 ? "✪" : "✩" /* Real icon: "⚝" */}`,
      coinsFormatted: Number(coins).toLocaleString("en"),
      modes,
      challenges,
    },
  };

  let resultData: typeof json3 & {
    success: boolean;
    username: string;
    cached?: boolean;
    uuid: string;
    hypixelId: string;
    time: Date;
    raw_bwstats: any;
  } = { success: true, ...json3, raw_bwstats: bwStats };
  return resultData;
}

// export const getStatsCached: typeof getStats = async (user: PlayerUser, { key } = {}): Promise<BWStatsData> => {
//   // console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
//   // console.log(`FUNCTIONS_EMULATOR: ${process.env.FUNCTIONS_EMULATOR}`);

//   let qs = await admin
//     .firestore()
//     .collection("bwstats-queries2")
//     .where("time", ">=", new Date(Date.now() - (process.env.FUNCTIONS_EMULATOR ? 5 / 60 : 3) /* min */ * 60 /* sec */ * 1000 /* ms */))
//     .where("uuid", "==", user.uuid.toLowerCase())
//     .where(new admin.firestore.FieldPath("data", "cached"), "==", false)
//     .orderBy("time", "desc")
//     .limit(1)
//     .get();
//   if (qs.empty) {
//     // console.log("Missed Cache");
//     return getStats(user, { key });
//   }
//   let data = qs.docs[0].data().data;

//   return { ...data, time: data.time.toDate(), cached: true };
// };

export const getStatsCached = async (user: PlayerUser, { ip } = { ip: "noip" }): Promise<BWStatsData> =>
  new Promise<BWStatsData>((resolve, reject) => {
    // resolve(getStats(user, { key }));
    // return;
    // eslint-disable-next-line no-unreachable
    console.log(user);
    UserQuery.findOne({
      uuid: user.uuid.toLowerCase(),
      time: { $gte: new Date(Date.now() - (process.env.FUNCTIONS_EMULATOR ? 2 : 5) /* min */ * 60 /* sec */ * 1000 /* ms */) },
      cached: false,
    })
      .sort({ time: -1 })
      .limit(1)
      .then(async (q) => {
        if (q) resolve({ ...q.data, cached: true });
        else {
          let data = await getStats(user);
          resolve(data);

          UserQuery.create({
            ip,
            username: user.username,
            uuid: user.uuid.toLowerCase(),
            data,
          });
        }
      })
      .catch(reject);
  });

export type BWStatsData = Awaited<ReturnType<typeof getStats>>;
