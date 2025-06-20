import * as functions from "firebase-functions";
import app from "./app";

export const bwstats = functions.runWith({ memory: "512MB", timeoutSeconds: 15 }).https.onRequest(app as any);
