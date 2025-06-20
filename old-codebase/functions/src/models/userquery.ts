import * as mongoose from "mongoose";

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
  },
  { capped: { size: 2 * 1024 * 1024, max: 100, autoIndexId: true } }
);

userQuerySchema.pre("validate", function (next) {
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

export default mongoose.model("UserQuery", userQuerySchema, "queries");
