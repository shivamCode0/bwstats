import * as mongoose from "mongoose";
import { isDev } from "./util/isDev";
import { MongoMemoryServer } from "mongodb-memory-server";

if (!isDev())
  mongoose.connect(`mongodb+srv://bwstats-user:${process.env.MONGODB_PWD}@shivam-test1.lwr9z.mongodb.net/bwstats?retryWrites=true&w=majority`, { maxPoolSize: 2 }).then(() => {
    console.log("Connected to MongoDB");
  });
else {
  (async () => {
    const mongoServer = await MongoMemoryServer.create();
    mongoose.connect(mongoServer.getUri(), { maxPoolSize: 2 }).then(() => {
      console.log("Connected to MOCK MongoDB - NOT REAL DB! JUST FOR TESTING");
    });
  })();
}
