import mongoose from "mongoose";
import { BWStatsData } from "@/types";

const userQuerySchema = new mongoose.Schema(
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
    username: {
      type: String,
      required: true,
    },
    uuid: {
      type: String,
      required: true,
    },
    cached: {
      type: Boolean,
      default: false,
    },
  },
  { capped: { size: 2 * 1024 * 1024, max: 100, autoIndexId: true } }
);

export interface UserQueryDocument extends mongoose.Document {
  data: BWStatsData;
  ip?: string;
  time: Date;
  username: string;
  uuid: string;
  cached: boolean;
}

export default mongoose.models.UserQuery || mongoose.model<UserQueryDocument>("UserQuery", userQuerySchema, "queries");
