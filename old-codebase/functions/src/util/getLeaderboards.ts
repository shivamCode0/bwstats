import axios from "axios";
import * as admin from "firebase-admin";
import { getStatsCached } from "./getStats";
import { getUser } from "./getUser";
import { isDev } from "./isDev";
import { saveData } from "./saveData";
import LBQuery from "../models/lbquery";

export async function getLeaderboards() {
  let key = process.env.HYPIXEL_API_KEY;
  let hypixelTimeStart = Date.now();
  let v1 = await axios.get("https://api.hypixel.net/leaderboards", { params: { key } }).catch((e) => {
    if (e.response.data.throttle) throw new Error("The Hypixel API key is being rate-limited");
    else if (e.response.data.cause == "Invalid API key") throw new Error("Invalid API Key");
    else throw new Error(JSON.stringify(e.response));
  });
  console.log(`Got Hypixel Data after ${(Date.now() - hypixelTimeStart) / 1000}s`);
  console.log(`Hypixel API Rate Limit: ${v1.headers["ratelimit-remaining"]}/${v1.headers["ratelimit-limit"]} remaining, resets in ${v1.headers["ratelimit-reset"]}s`);

  let json1: {
    path: string;
    prefix: string;
    title: string;
    location: string;
    count: number;
    leaders: string[];
  }[] = v1.data.leaderboards.BEDWARS;

  let json2 = Object.fromEntries(
    json1.map((v) => {
      let { path, location, ...rest } = v;
      return [path, rest];
    })
  );

  let json3 = Object.fromEntries(
    await Promise.all<[string, PlayerUser[]]>(
      Object.entries({
        level: json2.bedwars_level,
        wins: json2.wins_new,
        finalKills: json2.final_kills_new,
      }).map(async ([k, v]) => {
        let uuids = v.leaders.slice(0, 20);
        let players = await Promise.all(
          uuids.map((v) =>
            getUser(v)
              .then((v) => getStatsCached(v))
              .then((v) => ({
                uuid: v.uuid,
                username: v.username,
                level: v.stats.level,
                levelFormatted: v.stats.levelFormatted,
                totalWins: v.stats.modes.total.wins,
                totalFinals: v.stats.modes.total.finalKills,
                totalFinalsFormatted: v.stats.modes.total.finalKills.toLocaleString(),
              }))
          )
        );
        return [k, players] as [string, PlayerUser[]];
      })
    )
  );

  let json4 = {
    cached: false,
    time: new Date(),
    stats: json3,
  };

  saveData(json4, "leaderboards", isDev() ? "lb-dev" : "lb");

  return json4;
}

// export const getLeaderboardsCached = async (longCache = false): Promise<BWLeaderboardsData> =>
//   new Promise((resolve, reject) => {
//     // console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
//     // console.log(`FUNCTIONS_EMULATOR: ${process.env.FUNCTIONS_EMULATOR}`);

//     admin
//       .firestore()
//       .collection("bwstats-lb")
//       .where("time", ">=", new Date(Date.now() - (longCache ? 96 : 12) /* hour */ * 60 /* min */ * 60 /* sec */ * 1000 /* ms */))
//       .where(new admin.firestore.FieldPath("data", "cached"), "==", false)
//       .orderBy("time", "desc")
//       .limit(1)
//       .get()
//       .then((qs) => {
//         if (qs.empty) {
//           console.log("Missed Cache");
//           if (!longCache) {
//             resolve(getLeaderboardsCached(true));
//             getLeaderboards().then((data) =>
//               admin.firestore().collection("bwstats-lb").add({
//                 time: admin.firestore.FieldValue.serverTimestamp(),
//                 data,
//               })
//             );
//           } else resolve(getLeaderboards());
//         } else {
//           let data = qs.docs[0].data().data;

//           resolve({ ...data, time: data.time.toDate(), cached: true });
//         }
//       });
//   });

export const getLeaderboardsCached = async ({ ip } = { ip: "noip" }): Promise<BWLeaderboardsData> =>
  new Promise<BWLeaderboardsData>((resolve, reject) => {
    // console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
    // console.log(`FUNCTIONS_EMULATOR: ${process.env.FUNCTIONS_EMULATOR}`);

    LBQuery.findOne({
      time: { $gte: new Date(Date.now() - 4 /* hr */ * 60 /* min */ * 60 /* sec */ * 1000 /* ms */) },
    })
      .sort({ time: -1 })
      .limit(1)
      .then(async (q) => {
        if (q) resolve({ ...q.data, cached: true });
        else {
          console.log("Missed Cache");
          let data = await getLeaderboards();
          resolve(data);
          LBQuery.create({ ip, data });
        }
      })
      .catch(reject);

    // let qs = await admin
    //   .firestore()
    //   .collection("bwstats-lb")
    //   .where("time", ">=", new Date(Date.now() - (isDev() ? 8 : 12) /* hour */ * 60 /* min */ * 60 /* sec */ * 1000 /* ms */))
    //   .where(new admin.firestore.FieldPath("data", "cached"), "==", false)
    //   .orderBy("time", "desc")
    //   .limit(1)
    //   .get();
    // if (qs.empty) {
    //   console.log("Missed Cache");
    //   return getLeaderboards();
    // }
    // let data = qs.docs[0].data().data;

    // return { ...data, time: data.time.toDate(), cached: true };
  });

export type BWLeaderboardsData = Awaited<ReturnType<typeof getLeaderboards>>;
