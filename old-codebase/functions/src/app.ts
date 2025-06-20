require("dotenv").config();
import * as express from "express";
import "./db";
import UserQuery from "./models/userquery";
import { chunk } from "./util/arrayChunk";
import { CHALLENGES, FRIENDLY_EXTRA_MODE_NAMES, FRIENDLY_LB_NAMES, FRIENDLY_MODE_NAMES, FRIENDLY_STAT_NAMES, LB_ORDER } from "./util/const";
import { getLeaderboardsCached } from "./util/getLeaderboards";
import { getStatsCached } from "./util/getStats";
import { getUser } from "./util/getUser";
import { render } from "./util/render";
import { generateSummary } from "./util/summary";

const app = express();
app.disable("x-powered-by");
app.set("view engine", "ejs");
app.set("trust proxy", true);

app.use((req, res, next) => {
  let temp_ip = req.header("cf-connecting-ip") || req.header("x-forwarded-for") || req.ip || "noip";
  if (temp_ip.substr(0, 7) === "::ffff:") temp_ip = temp_ip.substr(7);
  req.cf_ip = temp_ip;
  return void next();
});

app.get("/user", (req, res) => {
  if (req.query.user) res.redirect(`/user/${req.query.user}`);
  else res.redirect("/");
});

app.get("/user/:user", async (req, res) => {
  console.log(req.params.user);
  if (!req.params.user) return void res.status(400).send("");

  try {
    let user = await getUser(req.params.user).catch((err) => {
      return void res.status(404).render("player", { success: false, error: err.toString() });
    });
    if (!user) return;

    let ip = req.cf_ip;
    let data = await getStatsCached(user, { ip });

    let { total: _, ...allModesExceptOverallFriendlyNames } = { ...FRIENDLY_MODE_NAMES, ...FRIENDLY_EXTRA_MODE_NAMES };
    let mostPlayedMode = allModesExceptOverallFriendlyNames[Object.entries(data.stats.modes).sort((a, b) => b[1].gamesPlayed - a[1].gamesPlayed)[0][0]];
    let startTime = process.hrtime();
    res.contentType("html").send(
      await render("player", {
        data: data,
        mostPlayedMode,
        summary: generateSummary(data),
        timeFormatted: data.time.toTimeString(),
        FRIENDLY_STAT_NAMES,
        FRIENDLY_MODE_NAMES,
        FRIENDLY_EXTRA_MODE_NAMES: {
          ...Object.fromEntries(
            Object.keys(data.stats.modes)
              .filter((v) => !Object.keys(FRIENDLY_MODE_NAMES).includes(v))
              .map((v) => [v, v])
          ),
          ...FRIENDLY_EXTRA_MODE_NAMES,
        },
        CHALLENGES,
        formatTitle: (C) =>
          `
<b>Challenge ${C.n + 1} - ${C.name}</b>
${C.rules.map((r, i) => `${i + 1}. ${r}\n`).join("")}
<span>Reward: ${C.reward}</span>`
            .trim()
            .replaceAll("\n", "<br />"),
        success: true,
      })
    );
    let totalTime1 = process.hrtime(startTime);
    let totalTime = totalTime1[0] * 1e3 + totalTime1[1] / 1e6;
    console.log(`${ip} ${req.params.user} ${totalTime}ms`);
  } catch (err) {
    console.log("Error", err);
    res
      .status(500)
      .contentType("html")
      .send(await render("player", { success: false, error: err.toString() }));
  }
});

app.get("/leaderboards", async (req, res) => {
  try {
    let ip = req.cf_ip;
    let data = await getLeaderboardsCached({ ip });

    render("leaderboards", {
      data,
      timeFormatted: data.time.toTimeString(),
      success: true,
      FRIENDLY_LB_NAMES,
      LB_ORDER,
      // Util method
      chunk,
    })
      .then((v) => res.contentType("html").send(v))
      .catch((err) => {
        console.log("Error1", err);

        render("leaderboards", { success: false, error: err.toString() })
          .then((v) => res.status(500).contentType("html").send(v))
          .catch((err) => {
            console.log(err);
          });
      });
  } catch (err) {
    console.log("Error", err);

    render("leaderboards", { success: false, error: err.toString() })
      .then((v) => res.status(500).contentType("html").send(v))
      .catch((err) => {
        console.log(err);
      });
  }
});

app.get("/api-v1/user/:user", async (req, res) => {
  return void res.status(400).send("API permanently discontinued, check back later!");
});

app.get("/iptest", (req, res) => res.send({ ip: req.ip, headers: req.headers, ips: req.ips, test1: req.headers["cf-connecting-ip"] || req.headers["x-forwarded-for"] || req.ip, cf_ip: req.cf_ip }));

app.get("/lookupdata", async (req, res) => {
  if (req.query.pwd != "shivam") return void res.status(403).send();
  else {
    UserQuery.find()
      .sort({ time: -1 })
      .limit(100)
      .then((v) => {
        res.render("viewdata1", { data: v });
      });
  }
});

export default app;
