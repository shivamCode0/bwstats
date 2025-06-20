import mongoose from "mongoose";
import { BWLeaderboardsData } from "@/types";

const lbQuerySchema = new mongoose.Schema(
  {
    data: {
      type: Object,
      required: true,
    },
    ip: {
      type: String,
      required: false,
    },
    time: {
      type: Date,
      default: Date.now,
    },
  },
  { capped: { size: 2 * 1024 * 1024, max: 30, autoIndexId: true } }
);

export interface LBQueryDocument extends mongoose.Document {
  data: BWLeaderboardsData;
  ip?: string;
  time: Date;
}

export default mongoose.models.LBQuery || mongoose.model<LBQueryDocument>("LBQuery", lbQuerySchema, "lb-queries");
