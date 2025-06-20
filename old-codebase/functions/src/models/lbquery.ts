import * as mongoose from "mongoose";

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

lbQuerySchema.pre("validate", function (next) {
  // admin
  //   .auth()
  //   .getUser(this.firebaseuid)
  //   .then((userRecord) => log("Successfully fetched user data:", userRecord.toJSON()))
  //   .catch(function (error) {
  //     log("Error fetching user data: " + error);
  //     next(error);
  //   });
  next();
});

export default mongoose.model("LBQuery", lbQuerySchema, "lb-queries");
